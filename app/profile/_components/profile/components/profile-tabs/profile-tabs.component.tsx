import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { OperatorActions } from './components/operator-actions/operator-actions.component';
import { OperatorAVSs } from './components/operator-avss/operator-avss.component';
import {
  OperatorDetails,
  Props as OperatorDetailsProps,
} from './components/operator-details/operator-details.component';
import { OperatorStakers } from './components/operator-stakers/operator-stakers.component';
import { OperatorStrategies } from './components/operator-strategies/operator-strategies.component';
import { StakerActions } from './components/staker-actions/staker-actions.component';
import {
  StakerDetails,
  Props as StakerDetailsProps,
} from './components/staker-details/staker-details.component';
import { StakerStakes } from './components/staker-stakes/staker-stakes.component';

import { StakerStake } from '../../profile.model';

import { Footer } from '@/app/_components/footer/footer.component';
import {
  Tabs,
  TabButton,
  TabContent,
  TabButtons,
  Fieldset,
  Legend,
} from '@/app/_components/tabs/tabs.styled';
import { StrategyEnriched, StrategiesMapEnriched } from '@/app/_models/strategies.model';

const PROFILE_TABS = {
  operatorDetails: 'operator-details',
  operatorStakers: 'operator-stakers',
  operatorAVSs: 'operator-avss',
  operatorStrategies: 'operator-strategies',
  operatorActions: 'operator-actions',
  stakerDetails: 'staker-details',
  stakerStakes: 'staker-stakes',
  stakerActions: 'staker-actions',
};

type Props = {
  id: string;
  tab: string | undefined;
  isOperator: boolean;
  isStaker: boolean;
  operatorDetails: OperatorDetailsProps;
  operatorActionsCount: number | undefined;
  stakerDetails: StakerDetailsProps;
  stakerStakes: Array<StakerStake> | undefined;
  stakerActionsCount: number | undefined;
  strategiesData: {
    strategies: Array<StrategyEnriched>;
    strategiesMap: StrategiesMapEnriched;
  };
};

export const ProfileTabs: React.FC<Props> = ({
  id,
  tab,
  isOperator,
  isStaker,
  strategiesData: { strategies, strategiesMap },
  operatorDetails,
  operatorActionsCount,
  stakerDetails,
  stakerStakes,
  stakerActionsCount,
}) => {
  const pathname = usePathname();
  const { replace } = useRouter();

  useEffect(() => {
    if (!tab || !Object.values(PROFILE_TABS).some((t) => t === tab.toLowerCase())) {
      replace(
        `${pathname}?id=${id}&tab=${isOperator ? PROFILE_TABS.operatorDetails : PROFILE_TABS.stakerDetails}`,
      );
    }
  }, [pathname, tab, replace, id, isOperator]);

  const isOperatorDetals = tab === PROFILE_TABS.operatorDetails;
  const isOperatorStakers = tab === PROFILE_TABS.operatorStakers;
  const isOperatorAVSs = tab === PROFILE_TABS.operatorAVSs;
  const isOperatorStrategies = tab === PROFILE_TABS.operatorStrategies;
  const isOperatorActions = tab === PROFILE_TABS.operatorActions;
  const isStakerDetails = tab === PROFILE_TABS.stakerDetails;
  const isStakerStakes = tab === PROFILE_TABS.stakerStakes;
  const isStakerActions = tab === PROFILE_TABS.stakerActions;

  return isOperator || isStaker ? (
    <>
      <Tabs>
        {isOperator && (
          <Fieldset role="presentation">
            <Legend>Operator:</Legend>
            <TabButtons>
              {/* TODO loop render */}
              <Link prefetch={false} href={{ query: { id, tab: PROFILE_TABS.operatorDetails } }}>
                <TabButton $active={isOperatorDetals}>Details</TabButton>
              </Link>
              <Link prefetch={false} href={{ query: { id, tab: PROFILE_TABS.operatorStakers } }}>
                <TabButton $active={isOperatorStakers}>Stakers</TabButton>
              </Link>
              <Link prefetch={false} href={{ query: { id, tab: PROFILE_TABS.operatorAVSs } }}>
                <TabButton $active={isOperatorAVSs}>AVSs</TabButton>
              </Link>
              <Link prefetch={false} href={{ query: { id, tab: PROFILE_TABS.operatorStrategies } }}>
                <TabButton $active={isOperatorStrategies}>Strategies</TabButton>
              </Link>
              <Link prefetch={false} href={{ query: { id, tab: PROFILE_TABS.operatorActions } }}>
                <TabButton $active={isOperatorActions}>Actions</TabButton>
              </Link>
            </TabButtons>
          </Fieldset>
        )}
        {isStaker && (
          <Fieldset role="presentation">
            <Legend>Staker:</Legend>
            <TabButtons>
              <Link prefetch={false} href={{ query: { id, tab: PROFILE_TABS.stakerDetails } }}>
                <TabButton $active={isStakerDetails}>Details</TabButton>
              </Link>
              <Link prefetch={false} href={{ query: { id, tab: PROFILE_TABS.stakerStakes } }}>
                <TabButton $active={isStakerStakes}>Stakes</TabButton>
              </Link>
              <Link prefetch={false} href={{ query: { id, tab: PROFILE_TABS.stakerActions } }}>
                <TabButton $active={isStakerActions}>Actions</TabButton>
              </Link>
            </TabButtons>
          </Fieldset>
        )}
      </Tabs>
      <TabContent $footerPressedToBottom={isOperatorDetals || isStakerDetails}>
        {isOperatorDetals && <OperatorDetails {...operatorDetails} />}
        {isOperatorStakers && (
          <OperatorStakers
            id={id}
            strategiesMap={strategiesMap}
            delegatorsCount={operatorDetails.delegatorsCount}
          />
        )}
        {isOperatorAVSs && <OperatorAVSs id={id} strategies={strategies} strategiesMap={strategiesMap} />}
        {isOperatorStrategies && <OperatorStrategies id={id} strategiesMap={strategiesMap} />}
        {isOperatorActions && typeof operatorActionsCount === 'number' && (
          <OperatorActions id={id} actionsCount={operatorActionsCount} />
        )}
        {isStakerDetails && <StakerDetails {...stakerDetails} />}
        {isStakerStakes && stakerStakes && (
          <StakerStakes stakes={stakerStakes} strategiesMap={strategiesMap} />
        )}
        {isStakerActions && typeof stakerActionsCount === 'number' && (
          <StakerActions id={id} actionsCount={stakerActionsCount} />
        )}
      </TabContent>
    </>
  ) : (
    <TabContent $footerPressedToBottom>
      <section />
      <Footer />
    </TabContent>
  );
};
