import { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';

import { TabsHeaderContent } from './avs-tabs.styled';
import { OperatorsQuorumWeights } from './avs-tabs.model';
import { Select } from './components/select/select.component';
import { AVSDetails, Props as AVSDetailsProps } from './components/avs-details/avs-details.component';
import { AVSOperators } from './components/avs-operators/avs-operators.component';
import { AVSActions } from './components/avs-actions/avs-actions.component';

import { AVSAction, AVSOperator, Quorum } from '../../avs.model';
import { calculateAVSTVLs } from '../../../../../_utils/avs.utils';

import {
  Tabs,
  TabButton,
  TabContent,
  TabButtons,
  Fieldset,
  Legend,
} from '@/app/_components/tabs/tabs.styled';
import { StrategyToEthBalance } from '@/app/_models/strategies.model';
import { add } from '@/app/_utils/big-number.utils';

const AVS_TABS = {
  details: 'avs-details',
  operators: 'avs-operators',
  actions: 'avs-actions',
};

type Props = {
  id: string;
  tab: string | undefined;
  avsDetails: Omit<AVSDetailsProps, 'ethTvl' | 'eigenTvl' | 'weights' | 'minimalStake'>;
  quorums: Array<Quorum>;
  registrations: Array<AVSOperator>;
  strategyToEthBalance: StrategyToEthBalance;
  actions: Array<AVSAction>;
};

export const AVSTabs: React.FC<Props> = ({
  id,
  tab,
  avsDetails,
  quorums,
  registrations,
  actions,
  strategyToEthBalance,
}) => {
  const pathname = usePathname();
  const { replace } = useRouter();

  useEffect(() => {
    if (!tab || !Object.values(AVS_TABS).some((t) => t === tab.toLowerCase())) {
      replace(`${pathname}?id=${id}&tab=${AVS_TABS.details}`);
    }
  }, [pathname, tab, replace, id]);

  const isDetails = tab === AVS_TABS.details;
  const isOperators = tab === AVS_TABS.operators;
  const isActions = tab === AVS_TABS.actions;

  const quorumsOptions = useMemo(
    () => quorums.map(({ quorum }) => ({ value: String(quorum), label: `Quorum ${quorum}` })),
    [quorums],
  );

  const [quorum, setQuorum] = useState(quorumsOptions.length > 0 ? Number(quorumsOptions[0].value) : null);

  const selectedQuorums = useMemo(() => quorums.filter((q) => q.quorum === quorum), [quorum, quorums]);

  const { ethTvl, eigenTvl } = useMemo(
    () => calculateAVSTVLs(selectedQuorums, registrations, strategyToEthBalance),
    [registrations, selectedQuorums, strategyToEthBalance],
  );

  const operatorsQuorumWeights = useMemo(
    () =>
      selectedQuorums.at(0)?.operators.reduce<OperatorsQuorumWeights>(
        (weights, { operator, totalWeight }) => {
          weights[operator.id] = totalWeight;
          weights.totalWeight = add(weights.totalWeight, totalWeight).toFixed();

          return weights;
        },
        { totalWeight: '0' },
      ) ?? null,
    [selectedQuorums],
  );

  return (
    <>
      <Tabs>
        <Fieldset role="presentation">
          <Legend>AVS:</Legend>
          <TabsHeaderContent>
            <TabButtons>
              <Link href={{ query: { id, tab: AVS_TABS.details } }}>
                <TabButton $active={isDetails}>Details</TabButton>
              </Link>
              <Link href={{ query: { id, tab: AVS_TABS.operators } }}>
                <TabButton $active={isOperators}>Operators</TabButton>
              </Link>
              <Link href={{ query: { id, tab: AVS_TABS.actions } }}>
                <TabButton $active={isActions}>Actions</TabButton>
              </Link>
            </TabButtons>
            {quorums.length > 0 && (
              <Select
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
            {...avsDetails}
            minimalStake={selectedQuorums.length > 0 ? selectedQuorums[0].minimalStake : null}
            ethTvl={ethTvl.toFixed()}
            eigenTvl={eigenTvl.toFixed()}
            weights={operatorsQuorumWeights}
          />
        )}
        {isOperators && (
          <AVSOperators
            operators={
              selectedQuorums.length > 0 && selectedQuorums[0].operatorsCount > 0
                ? selectedQuorums[0].operators
                : registrations
            }
            weights={operatorsQuorumWeights}
            strategyToEthBalance={strategyToEthBalance}
          />
        )}
        {isActions && <AVSActions actions={actions} />}
      </TabContent>
    </>
  );
};
