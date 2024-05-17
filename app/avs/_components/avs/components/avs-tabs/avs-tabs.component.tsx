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
import { calculateAVSTVLS } from '../../avs.utils';

import {
  Tabs,
  TabButton,
  TabContent,
  TabButtons,
  Fieldset,
  Legend,
} from '@/app/_components/tabs/tabs.styled';
import { Strategy } from '@/app/_models/strategies.model';
import { createStrategyToTvlMap } from '@/app/_utils/strategies.utils';

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
  strategies: Array<Strategy>;
  registrations: Array<AVSOperator>;
  actions: Array<AVSAction>;
};

type QuorumOption = {
  value: string;
  label: string;
};
export const AVSTabs: React.FC<Props> = ({
  id,
  tab,
  avsDetails,
  quorums,
  strategies,
  registrations,
  actions,
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
    () => quorums.map(({ quorum }): QuorumOption => ({ value: String(quorum), label: `Quorum ${quorum}` })),
    [quorums],
  );
  const strategyToTvl = useMemo(() => createStrategyToTvlMap(strategies), [strategies]);

  const [quorum, setQuorum] = useState(quorumsOptions.length > 0 ? Number(quorumsOptions[0].value) : null);

  const selectedQuorums = useMemo(() => quorums.filter((q) => q.quorum === quorum), [quorum, quorums]);

  const { ethTvl, eigenTvl } = useMemo(
    () => calculateAVSTVLS(selectedQuorums, registrations, strategyToTvl),
    [registrations, selectedQuorums, strategyToTvl],
  );

  const operatorsQuorumWeights = useMemo(
    () =>
      selectedQuorums.at(0)?.operators.reduce<OperatorsQuorumWeights>(
        (weights, { operator, totalWeight }) => {
          const weight = Number(totalWeight);
          weights[operator.id] ??= 0;
          weights[operator.id] += weight;
          weights.totalWeight += weight;

          return weights;
        },
        { totalWeight: 0 },
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
            {...avsDetails}
            minimalStake={selectedQuorums.length > 0 ? Number(selectedQuorums[0].minimalStake) / 1e18 : null}
            eigenTvl={eigenTvl}
            ethTvl={ethTvl}
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
            strategyToTvl={strategyToTvl}
          />
        )}
        {isActions && <AVSActions actions={actions} />}
      </TabContent>
    </>
  );
};
