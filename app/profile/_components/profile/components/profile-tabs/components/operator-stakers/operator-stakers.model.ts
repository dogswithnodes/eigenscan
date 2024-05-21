'use client';
import { ColumnType } from 'antd/es/table';

import { EIGEN_STRATEGY } from '@/app/_constants/addresses.constants';
import { StrategyToEthBalance } from '@/app/_models/strategies.model';
import { renderAddressLink, renderBigNumber, renderDate } from '@/app/_utils/render.utils';
import { formatTableDate } from '@/app/_utils/table.utils';
import { calculateTotalAssets, toEth } from '@/app/_utils/big-number.utils';
import { BN_ZERO } from '@/app/_constants/big-number.constants';

export type OperatorStaker = {
  id: string;
  staker: {
    totalEigenShares: string;
  };
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
  staker__totalEigenShares: number;
  delegatedAt: string;
  undelegatedAt: string | null;
};

const titles: Record<Exclude<keyof OperatorStakersRow, 'key'>, string> = {
  id: 'Staker',
  totalShares: 'Staked ETH',
  staker__totalEigenShares: 'Staked Eigen',
  delegatedAt: 'Last delegation',
  undelegatedAt: 'Last undelegation',
};

export const columnsWidth = {
  '2560': [413, 412, 412, 412, 412],
  '1920': [288, 287, 287, 287, 287],
  '1440': [256, 255, 255, 255, 255],
  '1280': [237, 237, 236, 236, 236],
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
    title: titles.staker__totalEigenShares,
    dataIndex: 'staker__totalEigenShares',
    key: 'staker__totalEigenShares',
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
  { id, delegations, staker, delegatedAt, undelegatedAt }: OperatorStaker,
  strategyToEthBalance: StrategyToEthBalance,
): OperatorStakersRow => {
  const stakedEth = delegations.reduce((acc, { shares, strategy }) => {
    if (strategy.id !== EIGEN_STRATEGY) {
      acc = acc.plus(calculateTotalAssets(shares, strategyToEthBalance[strategy.id], strategy.totalShares));
    }

    return acc;
  }, BN_ZERO);

  return {
    key: id,
    id,
    totalShares: Number(toEth(stakedEth)),
    staker__totalEigenShares: Number(toEth(staker.totalEigenShares)),
    delegatedAt: delegatedAt,
    undelegatedAt: undelegatedAt,
  };
};

export const transformToCsvRow = ({
  id,
  totalShares,
  staker__totalEigenShares,
  delegatedAt,
  undelegatedAt,
}: OperatorStakersRow) => ({
  [titles.id]: id,
  [titles.totalShares]: totalShares,
  [titles.staker__totalEigenShares]: staker__totalEigenShares,
  [titles.delegatedAt]: delegatedAt ? formatTableDate(delegatedAt) : null,
  [titles.undelegatedAt]: undelegatedAt ? formatTableDate(undelegatedAt) : null,
});
