'use client';
import { ColumnType } from 'antd/es/table';

import { EIGEN_STRATEGY } from '@/app/_constants/addresses.constants';
import { BN_ZERO } from '@/app/_constants/big-number.constants';
import { PROFILE_TABLES } from '@/app/_constants/tables.constants';
import { StrategiesMap } from '@/app/_models/strategies.model';
import { mulDiv } from '@/app/_utils/big-number.utils';
import { renderAddressLink, renderBigNumber, renderDate } from '@/app/_utils/render.utils';
import { formatTableDate } from '@/app/_utils/table.utils';

export type OperatorStaker = {
  id: string;
  staker: {
    id: string;
    totalEigenShares: string;
  };
  delegations: Array<{
    shares: string;
    strategy: {
      id: string;
    };
  }>;
  delegatedAt: string;
  undelegatedAt: string | null;
};

export type OperatorStakersRow = {
  key: string;
  staker__id: string;
  staker__totalShares: string;
  staker__totalEigenShares: string;
  delegatedAt: string;
  undelegatedAt: string | null;
};

const titles: Record<Exclude<keyof OperatorStakersRow, 'key'>, string> = {
  staker__id: 'Staker',
  staker__totalShares: 'Staked ETH',
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
    title: titles.staker__id,
    dataIndex: 'staker__id',
    key: 'staker__id',
    align: 'center',
    render: renderAddressLink('profile', PROFILE_TABLES.staker.details),
  },
  {
    title: titles.staker__totalShares,
    dataIndex: 'staker__totalShares',
    key: 'staker__totalShares',
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
  strategiesMap: StrategiesMap,
): OperatorStakersRow => {
  const stakedEth = delegations.reduce((acc, { shares, strategy }) => {
    if (strategy.id !== EIGEN_STRATEGY) {
      const { ethBalance, totalSharesAndWithdrawing } = strategiesMap[strategy.id];

      acc = acc.plus(mulDiv(shares, ethBalance, totalSharesAndWithdrawing));
    }

    return acc;
  }, BN_ZERO);

  return {
    key: id,
    staker__id: staker.id,
    staker__totalShares: stakedEth.toFixed(),
    staker__totalEigenShares: staker.totalEigenShares,
    delegatedAt: delegatedAt,
    undelegatedAt: undelegatedAt,
  };
};

export const transformToCsvRow = ({
  staker__id,
  staker__totalShares,
  staker__totalEigenShares,
  delegatedAt,
  undelegatedAt,
}: OperatorStakersRow) => ({
  [titles.staker__id]: staker__id,
  [titles.staker__totalShares]: staker__totalShares,
  [titles.staker__totalEigenShares]: staker__totalEigenShares,
  [titles.delegatedAt]: delegatedAt ? formatTableDate(delegatedAt) : null,
  [titles.undelegatedAt]: undelegatedAt ? formatTableDate(undelegatedAt) : null,
});
