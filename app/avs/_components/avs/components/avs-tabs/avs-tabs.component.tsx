import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import { QuorumWeights } from './avs-tabs.model';
import { TabsHeaderContent } from './avs-tabs.styled';
import { AVSActions } from './components/avs-actions/avs-actions.component';
import { AVSDetails, Props as AVSDetailsProps } from './components/avs-details/avs-details.component';
import { AVSOperators } from './components/avs-operators/avs-operators.component';
import { AVSTokens } from './components/avs-tokens/avs-tokens.component';
import { Select } from './components/select/select.component';

import { calculateAVSTVLs } from '../../../../../_utils/avs.utils';
import { AVSOperator, Quorum } from '../../avs.model';

import {
  Tabs,
  TabButton,
  TabContent,
  TabButtons,
  Fieldset,
  Legend,
} from '@/app/_components/tabs/tabs.styled';
import { AVS_TABLES } from '@/app/_constants/tables.constants';
import { StrategiesMapEnriched } from '@/app/_models/strategies.model';
import { add, mul } from '@/app/_utils/big-number.utils';

type Props = {
  id: string;
  tab: string | undefined;
  avsDetails: Omit<
    AVSDetailsProps,
    'ethTvl' | 'eigenTvl' | 'operatorsWeights' | 'strategiesWeights' | 'minimalStake'
  >;
  quorums: Array<Quorum>;
  registrations: Array<AVSOperator>;
  strategiesMap: StrategiesMapEnriched;
};

type QuorumOption = {
  value: string;
  label: string;
};

export const AVSTabs: React.FC<Props> = ({ id, tab, avsDetails, quorums, registrations, strategiesMap }) => {
  const pathname = usePathname();
  const { replace } = useRouter();

  useEffect(() => {
    if (!tab || !Object.values(AVS_TABLES).some((t) => t === tab.toLowerCase())) {
      replace(`${pathname}?id=${id}&tab=${AVS_TABLES.details}`);
    }
  }, [pathname, tab, replace, id]);

  const isDetails = tab === AVS_TABLES.details;
  const isOperators = tab === AVS_TABLES.operators;
  const isActions = tab === AVS_TABLES.actions;
  const isTokens = tab === AVS_TABLES.tokens;

  const quorumsOptions = useMemo(
    () => quorums.map(({ quorum }): QuorumOption => ({ value: String(quorum), label: `Quorum ${quorum}` })),
    [quorums],
  );

  const [quorum, setQuorum] = useState(quorumsOptions.length > 0 ? Number(quorumsOptions[0].value) : null);

  const selectedQuorums = useMemo(() => quorums.filter((q) => q.quorum === quorum), [quorum, quorums]);

  const operatorsCount =
    selectedQuorums.length > 0 ? selectedQuorums[0].operatorsCount : avsDetails.operatorsCount;

  const { ethTvl, eigenTvl } = useMemo(
    () => calculateAVSTVLs(selectedQuorums, registrations, strategiesMap),
    [registrations, selectedQuorums, strategiesMap],
  );

  const operatorsQuorumWeights = useMemo(
    () =>
      selectedQuorums.at(0)?.operators.reduce<QuorumWeights>(
        (acc, { operator, totalWeight }) => {
          acc[operator.id] = totalWeight;
          acc.totalWeight = add(acc.totalWeight, totalWeight).toFixed();

          return acc;
        },
        { totalWeight: '0' },
      ) ?? null,
    [selectedQuorums],
  );

  const strategiesQuorumWeights = useMemo(() => {
    const selectedQuorum = selectedQuorums.at(0);

    if (selectedQuorum) {
      const { multipliers, operators } = selectedQuorum;

      const strategyToMultiply = multipliers.reduce<Record<string, string>>((acc, { multiply, strategy }) => {
        acc[strategy.id] = multiply;
        return acc;
      }, {});

      return operators.reduce<QuorumWeights>(
        (acc, { operator: { strategies } }) => {
          strategies.forEach(({ strategy }) => {
            const { totalShares, tokenSymbol } = strategiesMap[strategy.id];

            const weight = mul(totalShares, strategyToMultiply[strategy.id] ?? '0');
            acc[tokenSymbol] = add((acc[tokenSymbol] ??= '0'), weight).toFixed();
            acc.totalWeight = add(acc.totalWeight, weight).toFixed();
          });

          return acc;
        },
        { totalWeight: '0' },
      );
    }

    return null;
  }, [selectedQuorums, strategiesMap]);

  return (
    <>
      <Tabs>
        <Fieldset role="presentation">
          <Legend>AVS:</Legend>
          <TabsHeaderContent>
            <TabButtons>
              <Link prefetch={false} href={{ query: { id, tab: AVS_TABLES.details } }}>
                <TabButton $active={isDetails}>Details</TabButton>
              </Link>
              <Link prefetch={false} href={{ query: { id, tab: AVS_TABLES.operators } }}>
                <TabButton $active={isOperators}>Operators</TabButton>
              </Link>
              <Link prefetch={false} href={{ query: { id, tab: AVS_TABLES.actions } }}>
                <TabButton $active={isActions}>Actions</TabButton>
              </Link>
              <Link prefetch={false} href={{ query: { id, tab: AVS_TABLES.tokens } }}>
                <TabButton $active={isTokens}>Allowed Tokens</TabButton>
              </Link>
            </TabButtons>
            {quorums.length > 0 && (
              <Select<QuorumOption>
                defaultValue={quorumsOptions[0]}
                options={quorumsOptions}
                onChange={(option) => {
                  const value = option?.value;

                  if (value) {
                    setQuorum(Number(value));
                  }
                }}
              />
            )}
          </TabsHeaderContent>
        </Fieldset>
      </Tabs>
      <TabContent $footerPressedToBottom={isDetails}>
        {isDetails && (
          <AVSDetails
            {...{
              ...avsDetails,
              operatorsCount,
            }}
            minimalStake={selectedQuorums.length > 0 ? selectedQuorums[0].minimalStake : null}
            ethTvl={ethTvl.toFixed()}
            eigenTvl={eigenTvl.toFixed()}
            operatorsWeights={operatorsQuorumWeights}
            strategiesWeights={strategiesQuorumWeights}
          />
        )}
        {isOperators && (
          <AVSOperators
            id={id}
            operatorsCount={operatorsCount}
            quorum={quorum}
            quorumWeight={operatorsQuorumWeights?.totalWeight ?? null}
            strategiesMap={strategiesMap}
          />
        )}
        {selectedQuorums.at(0)?.multipliers.length && isTokens && (
          <AVSTokens id={id} multipliers={selectedQuorums[0].multipliers} strategiesMap={strategiesMap} />
        )}
        {isActions && <AVSActions id={id} />}
      </TabContent>
    </>
  );
};
