'use client';
import { StrategyCards } from './components/strategy-cards/strategy-cards.component';
import { StrategyTabs } from './components/strategy-tabs/strategy-tabs.component';

import { AccountPreloader } from '@/app/_components/account-preloader/account-preloader.component';
import { Empty } from '@/app/_components/empty/empty.component';
import { useEnrichedStrategies } from '@/app/_services/strategies.service';
import { add, mulDiv } from '@/app/_utils/big-number.utils';

type Props = {
  id: string;
  tab: string | undefined;
};

export const Strategy: React.FC<Props> = ({ id, tab }) => {
  const { data, isPending, error } = useEnrichedStrategies();

  if (isPending) {
    return <AccountPreloader />;
  }

  if (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    return <Empty />;
  }

  const strategy = data.strategies.find((s) => s.id === id);

  if (!strategy) {
    return <Empty />;
  }

  const {
    logo,
    name,
    whitelisted,
    stakesCount,
    delegationsCount,
    operatorsCount,
    underlyingToken,
    tokenSymbol,
    tokenDecimals,
    balance,
    totalDelegated,
    totalWithdrawing,
    totalShares,
    ethBalance,
  } = strategy;

  const denominator = add(totalShares, totalWithdrawing);

  return (
    <>
      <StrategyCards logo={logo} name={name} id={id} />
      <StrategyTabs
        id={id}
        tab={tab}
        balance={balance}
        totalShares={totalShares}
        strategyDetails={{
          whitelisted,
          stakesCount,
          delegationsCount,
          operatorsCount,
          underlyingToken,
          tokenSymbol,
          tokenDecimals,
          balance,
          totalDelegated: mulDiv(totalDelegated, balance, denominator).toFixed(),
          ethBalance,
          totalWithdrawals: mulDiv(totalWithdrawing, balance, denominator).toFixed(),
          totalDelegatedPercent: mulDiv(totalDelegated, 100, denominator).toFixed(1),
        }}
      />
    </>
  );
};
