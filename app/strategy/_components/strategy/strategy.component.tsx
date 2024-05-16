'use client';
import { StrategyCards } from './components/strategy-cards/strategy-cards.component';
import { StrategyTabs } from './components/strategy-tabs/strategy-tabs.component';

import { AccountPreloader } from '@/app/_components/account-preloader/account-preloader.component';
import { Empty } from '@/app/_components/empty/empty.component';
import { useStrategies } from '@/app/_services/strategies.service';

type Props = {
  id: string;
  tab: string | undefined;
};

export const Strategy: React.FC<Props> = ({ id, tab }) => {
  const { data, isPending, error } = useStrategies();

  if (isPending) {
    return <AccountPreloader />;
  }

  if (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    return <Empty />;
  }

  const strategy = data.find((s) => s.id === id);

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
    tvl,
  } = strategy;

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
          balance: Number(balance) / 1e18,
          totalDelegated:
            (Number(totalDelegated) * Number(balance)) /
            (1e18 * (Number(totalShares) + Number(totalWithdrawing))),
          ethTvl: Number(tvl) / 1e18,
          totalWithdrawals:
            (Number(totalWithdrawing) * Number(balance)) /
            (1e18 * (Number(totalShares) + Number(totalWithdrawing))),
          totalDelegatedPercent:
            (Number(totalDelegated) * 100) / (Number(totalShares) + Number(totalWithdrawing)),
        }}
      />
    </>
  );
};
