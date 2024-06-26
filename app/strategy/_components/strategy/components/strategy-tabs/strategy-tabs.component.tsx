import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { StrategyDelegations } from './components/strategy-delegations/strategy-delegations.component';
import {
  StrategyDetails,
  Props as StrategyDetailsProps,
} from './components/strategy-details/strategy-details.component';
import { StrategyOperators } from './components/strategy-operators/strategy-operators.component';
import { StrategyStakes } from './components/strategy-stakes/strategy-stakes.component';

import {
  Tabs,
  TabButton,
  TabContent,
  TabButtons,
  Fieldset,
  Legend,
} from '@/app/_components/tabs/tabs.styled';
import { STRATEGY_TABLES } from '@/app/_constants/tables.constants';

type Props = {
  id: string;
  tab: string | undefined;
  strategyDetails: StrategyDetailsProps;
  balance: string;
  totalSharesAndWithdrawing: string;
};

export const StrategyTabs: React.FC<Props> = ({
  id,
  tab,
  strategyDetails,
  strategyDetails: { operatorsCount, stakesCount, delegationsCount },
  balance,
  totalSharesAndWithdrawing,
}) => {
  const pathname = usePathname();
  const { replace } = useRouter();

  useEffect(() => {
    if (!tab || !Object.values(STRATEGY_TABLES).some((t) => t === tab.toLowerCase())) {
      replace(`${pathname}?id=${id}&tab=${STRATEGY_TABLES.details}`);
    }
  }, [pathname, tab, replace, id]);

  const isDetails = tab === STRATEGY_TABLES.details;
  const isOperators = tab === STRATEGY_TABLES.operators;
  const isStakes = tab === STRATEGY_TABLES.stakes;
  const isDelegations = tab === STRATEGY_TABLES.delegations;

  return (
    <>
      <Tabs>
        <Fieldset role="presentation">
          <Legend>Strategy:</Legend>
          <TabButtons>
            <Link prefetch={false} href={{ query: { id, tab: STRATEGY_TABLES.details } }}>
              <TabButton $active={isDetails}>Details</TabButton>
            </Link>
            <Link prefetch={false} href={{ query: { id, tab: STRATEGY_TABLES.operators } }}>
              <TabButton $active={isOperators}>Operators</TabButton>
            </Link>
            <Link prefetch={false} href={{ query: { id, tab: STRATEGY_TABLES.stakes } }}>
              <TabButton $active={isStakes}>Stakes</TabButton>
            </Link>
            <Link prefetch={false} href={{ query: { id, tab: STRATEGY_TABLES.delegations } }}>
              <TabButton $active={isDelegations}>Delegations</TabButton>
            </Link>
          </TabButtons>
        </Fieldset>
      </Tabs>
      <TabContent $footerPressedToBottom={isDetails}>
        {isDetails && <StrategyDetails {...strategyDetails} />}
        {isOperators && (
          <StrategyOperators
            id={id}
            operatorsCount={operatorsCount}
            balance={balance}
            totalSharesAndWithdrawing={totalSharesAndWithdrawing}
          />
        )}
        {isStakes && (
          <StrategyStakes
            id={id}
            stakesCount={stakesCount}
            balance={balance}
            totalSharesAndWithdrawing={totalSharesAndWithdrawing}
          />
        )}
        {isDelegations && (
          <StrategyDelegations
            id={id}
            delegationsCount={delegationsCount}
            balance={balance}
            totalSharesAndWithdrawing={totalSharesAndWithdrawing}
          />
        )}
      </TabContent>
    </>
  );
};
