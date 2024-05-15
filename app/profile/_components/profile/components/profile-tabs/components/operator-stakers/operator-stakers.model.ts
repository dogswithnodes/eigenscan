'use client';
import { ColumnType } from 'antd/es/table';

import { EIGEN_STRATEGY } from '@/app/_constants/addresses.constants';
import { renderAddressLink, renderBigNumber, renderDate } from '@/app/_utils/render.utils';
import { StrategyToTvlMap } from '@/app/_utils/strategies.utils';
import { formatTableDate } from '@/app/_utils/table.utils';

export type OperatorStakerServer = {
  id: string;
  delegations: Array<{
    shares: string;
    strategy: {
      id: string;
      totalShares: string;
    };
  }>;
  delegatedAt: string;
  undelegatedAt: string | null;
};

export type OperatorStakersRow = {
  key: string;
  id: string;
  totalShares: number;
  stakedEigen: number;
  delegatedAt: string;
  undelegatedAt: string | null;
};

const titles: Record<Exclude<keyof OperatorStakersRow, 'key'>, string> = {
  id: 'Staker',
  totalShares: 'Staked ETH',
  stakedEigen: 'Staked Eigen',
  delegatedAt: 'Last delegation',
  undelegatedAt: 'Last undelegation',
};

export const columnsWidth = {
  '2560': [344, 344, 344, 344, 344],
  '1920': [240, 240, 240, 240, 240],
  '1440': [213, 213, 213, 213, 213],
  '1280': [197, 197, 197, 197, 197],
};

export const columns: Array<ColumnType<OperatorStakersRow>> = [
  {
    title: titles.id,
    dataIndex: 'id',
    key: 'id',
    align: 'center',
    render: renderAddressLink('profile', 'staker-details'),
  },
  {
    title: titles.totalShares,
    dataIndex: 'totalShares',
    key: 'totalShares',
    render: renderBigNumber,
  },
  {
    title: titles.stakedEigen,
    dataIndex: 'stakedEigen',
    key: 'stakedEigen',
    render: renderBigNumber,
  },
  {
    title: titles.delegatedAt,
    dataIndex: 'delegatedAt',
    key: 'delegatedAt',
    align: 'center',
    render: renderDate,
  },
  {
    title: titles.undelegatedAt,
    dataIndex: 'undelegatedAt',
    key: 'undelegatedAt',
    align: 'center',
    render: renderDate,
  },
];

export const transformToRow = (
  { id, delegations, delegatedAt, undelegatedAt }: OperatorStakerServer,
  strategyToTvl: StrategyToTvlMap,
): OperatorStakersRow => {
  const { stakedEth, stakedEigen } = delegations.reduce(
    (tvls, { shares, strategy }) => {
      const strategyTvl =
        (BigInt(shares) * BigInt(strategyToTvl[strategy.id])) / BigInt(strategy.totalShares);
      if (strategy.id !== EIGEN_STRATEGY) {
        tvls.stakedEth += strategyTvl;
      } else {
        tvls.stakedEigen += strategyTvl;
      }

      return tvls;
    },
    {
      stakedEth: BigInt(0),
      stakedEigen: BigInt(0),
    },
  );

  return {
    key: id,
    id,
    totalShares: Number(stakedEth) / 1e18,
    stakedEigen: Number(stakedEigen) / 1e18,
    delegatedAt: delegatedAt,
    undelegatedAt: undelegatedAt,
  };
};

export const transformToCsvRow = ({
  id,
  totalShares,
  stakedEigen,
  delegatedAt,
  undelegatedAt,
}: OperatorStakersRow) => ({
  [titles.id]: id,
  [titles.totalShares]: totalShares,
  [titles.stakedEigen]: stakedEigen,
  [titles.delegatedAt]: delegatedAt ? formatTableDate(delegatedAt) : null,
  [titles.undelegatedAt]: undelegatedAt ? formatTableDate(undelegatedAt) : null,
});
