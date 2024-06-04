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
import { PROFILE_TABLES } from '@/app/_constants/tables.constants';
import { StrategyEnriched, StrategiesMapEnriched } from '@/app/_models/strategies.model';

type Props = {
  id: string;
  tab: string | undefined;
  isOperator: boolean;
  isStaker: boolean;
  operatorDetails: OperatorDetailsProps;
  stakerDetails: StakerDetailsProps;
  stakerStakes: Array<StakerStake> | undefined;
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
  stakerDetails,
  stakerStakes,
}) => {
  const pathname = usePathname();
  const { replace } = useRouter();

  useEffect(() => {
    if (
      !tab ||
      ![...Object.values(PROFILE_TABLES.operator), ...Object.values(PROFILE_TABLES.staker)].some(
        (t) => t === tab.toLowerCase(),
      )
    ) {
      replace(
        // eslint-disable-next-line max-len
        `${pathname}?id=${id}&tab=${isOperator ? PROFILE_TABLES.operator.details : PROFILE_TABLES.staker.details}`,
      );
    }
  }, [pathname, tab, replace, id, isOperator]);

  const isOperatorDetals = tab === PROFILE_TABLES.operator.details;
  const isOperatorStakers = tab === PROFILE_TABLES.operator.stakers;
  const isOperatorAVSs = tab === PROFILE_TABLES.operator.avss;
  const isOperatorStrategies = tab === PROFILE_TABLES.operator.strategies;
  const isOperatorActions = tab === PROFILE_TABLES.operator.actions;
  const isStakerDetails = tab === PROFILE_TABLES.staker.details;
  const isStakerStakes = tab === PROFILE_TABLES.staker.stakes;
  const isStakerActions = tab === PROFILE_TABLES.staker.actions;

  return isOperator || isStaker ? (
    <>
      <Tabs>
        {isOperator && (
          <Fieldset role="presentation">
            <Legend>Operator:</Legend>
            <TabButtons>
              <Link prefetch={false} href={{ query: { id, tab: PROFILE_TABLES.operator.details } }}>
                <TabButton $active={isOperatorDetals}>Details</TabButton>
              </Link>
              <Link prefetch={false} href={{ query: { id, tab: PROFILE_TABLES.operator.stakers } }}>
                <TabButton $active={isOperatorStakers}>Stakers</TabButton>
              </Link>
              <Link prefetch={false} href={{ query: { id, tab: PROFILE_TABLES.operator.avss } }}>
                <TabButton $active={isOperatorAVSs}>AVSs</TabButton>
              </Link>
              <Link prefetch={false} href={{ query: { id, tab: PROFILE_TABLES.operator.strategies } }}>
                <TabButton $active={isOperatorStrategies}>Strategies</TabButton>
              </Link>
              <Link prefetch={false} href={{ query: { id, tab: PROFILE_TABLES.operator.actions } }}>
                <TabButton $active={isOperatorActions}>Actions</TabButton>
              </Link>
            </TabButtons>
          </Fieldset>
        )}
        {isStaker && (
          <Fieldset role="presentation">
            <Legend>Staker:</Legend>
            <TabButtons>
              <Link prefetch={false} href={{ query: { id, tab: PROFILE_TABLES.staker.details } }}>
                <TabButton $active={isStakerDetails}>Details</TabButton>
              </Link>
              <Link prefetch={false} href={{ query: { id, tab: PROFILE_TABLES.staker.stakes } }}>
                <TabButton $active={isStakerStakes}>Stakes</TabButton>
              </Link>
              <Link prefetch={false} href={{ query: { id, tab: PROFILE_TABLES.staker.actions } }}>
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
        {isOperatorActions && <OperatorActions id={id} />}
        {isStakerDetails && <StakerDetails {...stakerDetails} />}
        {isStakerStakes && stakerStakes && (
          <StakerStakes id={id} stakes={stakerStakes} strategiesMap={strategiesMap} />
        )}
        {isStakerActions && <StakerActions id={id} />}
      </TabContent>
    </>
  ) : (
    <TabContent $footerPressedToBottom>
      <section />
      <Footer />
    </TabContent>
  );
};
