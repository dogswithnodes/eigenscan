'use client';
import { useMemo } from 'react';

import { useAccount } from './profile.service';
import { ProfileCards } from './components/profile-cards/profile-cards.component';
import { ProfileTabs } from './components/profile-tabs/profile-tabs.component';

import { AccountPreloader } from '@/app/_components/account-preloader/account-preloader.component';
import { Empty } from '@/app/_components/empty/empty.component';
import { EIGEN_STRATEGY } from '@/app/_constants/addresses.constants';
import { useStrategies } from '@/app/_services/strategies.service';
import { createStrategyToTvlMap } from '@/app/_utils/strategies.utils';

type Props = {
  id: string;
  tab: string | undefined;
};

export const Profile: React.FC<Props> = ({ id, tab }) => {
  const account = useAccount(id);
  const strategies = useStrategies();

  const strategyToTvl = useMemo(
    () => (strategies.data ? createStrategyToTvlMap(strategies.data) : null),
    [strategies.data],
  );

  const operatorTVL = useMemo(() => {
    if (account.data?.operator && strategyToTvl) {
      return Number(
        account.data.operator.strategies.reduce((tvl, { totalShares, strategy }) => {
          tvl += (BigInt(totalShares) * BigInt(strategyToTvl[strategy.id])) / BigInt(strategy.totalShares);
          return tvl;
        }, BigInt(0)) / BigInt(1e18),
      );
    }
  }, [account, strategyToTvl]);

  const stakerStakesAndWithdrawals = useMemo(() => {
    if (account.data?.staker && strategyToTvl) {
      const { staker } = account.data;

      const { stakedEth, stakedEigen } = staker.stakes.reduce(
        (totals, { shares, strategy }) => {
          const strategyTvl =
            (BigInt(shares) * BigInt(strategyToTvl[strategy.id])) / BigInt(strategy.totalShares);
          if (strategy.id !== EIGEN_STRATEGY) {
            totals.stakedEth += strategyTvl;
          } else {
            totals.stakedEigen += strategyTvl;
          }

          return totals;
        },
        {
          stakedEth: BigInt(0),
          stakedEigen: BigInt(0),
        },
      );

      const totalWithdrawalsEth = staker.withdrawals.reduce((total, { strategies }) => {
        strategies.forEach(({ share, strategy }) => {
          total += (BigInt(share) * BigInt(strategyToTvl[strategy.id])) / BigInt(strategy.totalShares);
        });

        return total;
      }, BigInt(0));

      return {
        stakedEth: Number(stakedEth) / 1e18,
        stakedEigen: Number(stakedEigen) / 1e18,
        totalWithdrawalsEth: Number(totalWithdrawalsEth) / 1e18,
      };
    }
  }, [account, strategyToTvl]);

  if (account.isPending || strategies.isPending) {
    return <AccountPreloader />;
  }

  const error = account.error || strategies.error;

  if (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    return <Empty />;
  }

  if (!account.data || !strategies.data) {
    return <Empty />;
  }

  const { operator, staker, name, logo, description, website, twitter, isOperator, isStaker } = account.data;

  return (
    <>
      <ProfileCards
        id={id}
        name={name}
        logo={logo}
        created={operator?.registered}
        description={description}
      />
      <ProfileTabs
        id={id}
        tab={tab}
        isOperator={isOperator}
        isStaker={isStaker}
        operatorDetails={{
          website,
          twitter,
          tvl: operatorTVL,
          delegatorsCount: operator?.delegatorsCount,
        }}
        stakerDetails={{
          ...stakerStakesAndWithdrawals,
          operator: staker?.delegator?.operator?.id,
          stakesCount: staker?.stakesCount,
          withdrawalsCount: staker?.withdrawalsCount,
        }}
        stakerStakes={staker?.stakes}
        strategies={strategies.data}
        operatorActions={operator?.actions}
        stakerActions={staker?.actions}
      />
    </>
  );
};
