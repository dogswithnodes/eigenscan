'use client';
import { useMemo } from 'react';

import { useAccount } from './profile.service';
import { ProfileCards } from './components/profile-cards/profile-cards.component';
import { ProfileTabs } from './components/profile-tabs/profile-tabs.component';

import { AccountPreloader } from '@/app/_components/account-preloader/account-preloader.component';
import { Empty } from '@/app/_components/empty/empty.component';
import { EIGEN_STRATEGY } from '@/app/_constants/addresses.constants';
import { useEnrichedStrategies } from '@/app/_services/strategies.service';

type Props = {
  id: string;
  tab: string | undefined;
};

export const Profile: React.FC<Props> = ({ id, tab }) => {
  const account = useAccount(id);
  const strategies = useEnrichedStrategies();

  const operatorTVL = useMemo(() => {
    if (account.data?.operator && strategies.data?.strategyToEthBalance) {
      return Number(
        account.data.operator.strategies.reduce((tvl, { totalShares, strategy }) => {
          tvl +=
            (BigInt(totalShares) * BigInt(strategies.data.strategyToEthBalance[strategy.id])) /
            BigInt(strategy.totalShares);
          return tvl;
        }, BigInt(0)) / BigInt(1e18),
      );
    }
  }, [account, strategies]);

  const stakerStakesAndWithdrawals = useMemo(() => {
    if (account.data?.staker && strategies.data?.strategyToEthBalance) {
      const { staker } = account.data;
      const { strategyToEthBalance } = strategies.data;

      const stakedEth = staker.stakes.reduce((acc, { shares, strategy }) => {
        const strategyTvl =
          (BigInt(shares) * BigInt(strategyToEthBalance[strategy.id])) / BigInt(strategy.totalShares);
        if (strategy.id !== EIGEN_STRATEGY) {
          acc += strategyTvl;
        }

        return acc;
      }, BigInt(0));

      const totalWithdrawalsEth = staker.withdrawals.reduce((total, { strategies }) => {
        strategies.forEach(({ share, strategy }) => {
          total += (BigInt(share) * BigInt(strategyToEthBalance[strategy.id])) / BigInt(strategy.totalShares);
        });

        return total;
      }, BigInt(0));

      return {
        stakedEth: Number(stakedEth) / 1e18,
        totalWithdrawalsEth: Number(totalWithdrawalsEth) / 1e18,
      };
    }
  }, [account, strategies]);

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
          stakedEigen: staker?.totalEigenShares ? Number(staker.totalEigenShares) / 1e18 : undefined,
          withdrawnEigen: staker?.totalEigenWithdrawalsShares
            ? Number(staker.totalEigenWithdrawalsShares) / 1e18
            : undefined,
        }}
        stakerStakes={staker?.stakes}
        strategiesData={strategies.data}
        operatorActions={operator?.actions}
        stakerActions={staker?.actions}
      />
    </>
  );
};
