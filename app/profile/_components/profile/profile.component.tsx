'use client';
import { useMemo } from 'react';

import { ProfileCards } from './components/profile-cards/profile-cards.component';
import { ProfileTabs } from './components/profile-tabs/profile-tabs.component';
import { useAccount } from './profile.service';

import { AccountPreloader } from '@/app/_components/account-preloader/account-preloader.component';
import { Empty } from '@/app/_components/empty/empty.component';
import { EIGEN_STRATEGY } from '@/app/_constants/addresses.constants';
import { BN_ZERO } from '@/app/_constants/big-number.constants';
import { useEnrichedStrategies } from '@/app/_services/strategies.service';
import { mulDiv } from '@/app/_utils/big-number.utils';

type Props = {
  id: string;
  tab: string | undefined;
};

export const Profile: React.FC<Props> = ({ id, tab }) => {
  const account = useAccount(id);
  const strategies = useEnrichedStrategies();

  const operatorTVL = useMemo(() => {
    if (account.data?.operator && strategies.data?.strategyToEthBalance) {
      return account.data.operator.strategies.reduce((acc, { totalShares, strategy }) => {
        acc = acc.plus(
          mulDiv(totalShares, strategies.data.strategyToEthBalance[strategy.id], strategy.totalShares),
        );

        return acc;
      }, BN_ZERO);
    }
  }, [account, strategies]);

  const stakerStakesAndWithdrawals = useMemo(() => {
    if (account.data?.staker && strategies.data?.strategyToEthBalance) {
      const { staker } = account.data;
      const { strategyToEthBalance } = strategies.data;

      const stakedEth = staker.stakes.reduce((acc, { shares, strategy }) => {
        if (strategy.id !== EIGEN_STRATEGY) {
          acc = acc.plus(mulDiv(shares, strategyToEthBalance[strategy.id], strategy.totalShares));
        }

        return acc;
      }, BN_ZERO);

      const withdrawnEth = staker.withdrawals.reduce((acc, { strategies }) => {
        strategies.forEach(({ share, strategy }) => {
          acc = acc.plus(mulDiv(share, strategyToEthBalance[strategy.id], strategy.totalShares));
        });

        return acc;
      }, BN_ZERO);

      return {
        stakedEth: stakedEth.toFixed(),
        withdrawnEth: withdrawnEth.toFixed(),
      };
    }

    return {
      stakedEth: undefined,
      withdrawnEth: undefined,
    };
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
        url={isOperator ? 'https://app.eigenlayer.xyz/operator' : undefined}
      />
      <ProfileTabs
        id={id}
        tab={tab}
        isOperator={isOperator}
        isStaker={isStaker}
        operatorDetails={{
          website,
          twitter,
          tvl: operatorTVL?.toFixed(),
          delegatorsCount: operator?.delegatorsCount,
        }}
        stakerDetails={{
          ...stakerStakesAndWithdrawals,
          operator: staker?.delegator?.operator?.id,
          stakesCount: staker?.stakesCount,
          withdrawalsCount: staker?.withdrawalsCount,
          stakedEigen: staker?.totalEigenShares,
          withdrawnEigen: staker?.totalEigenWithdrawalsShares,
        }}
        stakerStakes={staker?.stakes}
        strategiesData={strategies.data}
        operatorActions={operator?.actions}
        stakerActions={staker?.actions}
      />
    </>
  );
};
