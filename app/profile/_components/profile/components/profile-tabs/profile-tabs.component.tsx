import { useEffect, useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';

import {
  OperatorDetails,
  Props as OperatorDetailsProps,
} from './components/operator-details/operator-details.component';
import { OperatorStakers } from './components/operator-stakers/operator-stakers.component';
import {
  StakerDetails,
  Props as StakerDetailsProps,
} from './components/staker-details/staker-details.component';
import { StakerStakes } from './components/staker-stakes/staker-stakes.component';
import { OperatorActions } from './components/operator-actions/operator-actions.component';
import { StakerActions } from './components/staker-actions/staker-actions.component';

import { OperatorAction, StakerStake, StakerAction } from '../../profile.model';

import {
  Tabs,
  TabButton,
  TabContent,
  TabButtons,
  Fieldset,
  Legend,
} from '@/app/_components/tabs/tabs.styled';
import { Footer } from '@/app/_components/footer/footer.component';
import { Strategy } from '@/app/_models/strategies.model';
import { createStrategyToTvlMap } from '@/app/_utils/strategies.utils';

const PROFILE_TABS = {
  operatorDetails: 'operator-details',
  operatorStakers: 'operator-stakers',
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
  operatorActions: Array<OperatorAction> | undefined;
  stakerDetails: StakerDetailsProps;
  stakerStakes: Array<StakerStake> | undefined;
  stakerActions: Array<StakerAction> | undefined;
  strategies: Array<Strategy>;
};

export const ProfileTabs: React.FC<Props> = ({
  id,
  tab,
  isOperator,
  isStaker,
  strategies,
  operatorDetails,
  operatorActions,
  stakerDetails,
  stakerStakes,
  stakerActions,
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
  const isOperatorActions = tab === PROFILE_TABS.operatorActions;
  const isStakerDetails = tab === PROFILE_TABS.stakerDetails;
  const isStakerStakes = tab === PROFILE_TABS.stakerStakes;
  const isStakerActions = tab === PROFILE_TABS.stakerActions;

  const strategyToTvl = useMemo(() => createStrategyToTvlMap(strategies), [strategies]);

  return isOperator || isStaker ? (
    <>
      <Tabs>
        {isOperator && (
          <Fieldset role="presentation">
            <Legend>Operator:</Legend>
            <TabButtons>
              {/* TODO loop render */}
              <Link href={{ query: { id, tab: PROFILE_TABS.operatorDetails } }}>
                <TabButton $active={isOperatorDetals}>Details</TabButton>
              </Link>
              <Link href={{ query: { id, tab: PROFILE_TABS.operatorStakers } }}>
                <TabButton $active={isOperatorStakers}>Stakers</TabButton>
              </Link>
              <Link href={{ query: { id, tab: PROFILE_TABS.operatorActions } }}>
                <TabButton $active={isOperatorActions}>Actions</TabButton>
              </Link>
            </TabButtons>
          </Fieldset>
        )}
        {isStaker && (
          <Fieldset role="presentation">
            <Legend>Staker:</Legend>
            <TabButtons>
              <Link href={{ query: { id, tab: PROFILE_TABS.stakerDetails } }}>
                <TabButton $active={isStakerDetails}>Details</TabButton>
              </Link>
              <Link href={{ query: { id, tab: PROFILE_TABS.stakerStakes } }}>
                <TabButton $active={isStakerStakes}>Stakes</TabButton>
              </Link>
              <Link href={{ query: { id, tab: PROFILE_TABS.stakerActions } }}>
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
            strategyToTvl={strategyToTvl}
            delegatorsCount={operatorDetails.delegatorsCount}
          />
        )}
        {isOperatorActions && operatorActions && <OperatorActions actions={operatorActions} />}
        {isStakerDetails && <StakerDetails {...stakerDetails} />}
        {isStakerStakes && stakerStakes && (
          <StakerStakes stakes={stakerStakes} strategies={strategies} strategyToTvl={strategyToTvl} />
        )}
        {isStakerActions && stakerActions && <StakerActions actions={stakerActions} />}
      </TabContent>
    </>
  ) : (
    <TabContent $footerPressedToBottom>
      <section />
      <Footer />
    </TabContent>
  );
};
