'use client';
import { ColumnType } from 'antd/es/table';

import { formatTableDate } from '@/app/_utils/table.utils';
import { renderAddressLink, renderBigNumber, renderDate } from '@/app/_utils/render.utils';

export type StakersRow = {
  key: string;
  id: string;
  totalShares: number;
  totalEigenShares: number;
  totalWithdrawalsShares: number;
  delegatedTo: string | null;
  lastDelegatedAt: string | null;
  lastUndelegatedAt: string | null;
};

const titles: Record<Exclude<keyof StakersRow, 'key'>, string> = {
  id: 'Staker',
  totalShares: 'Staked ETH',
  totalEigenShares: 'Staked Eigen',
  totalWithdrawalsShares: 'Withdrawn ETH',
  delegatedTo: 'Delegated to',
  lastDelegatedAt: 'Last delegation',
  lastUndelegatedAt: 'Last undelegation',
};

export const columnsWidth = {
  '2560': [295, 295, 295, 295, 295, 295, 295],
  '1920': [206, 206, 206, 206, 206, 206, 206],
  '1440': [183, 183, 183, 183, 183, 183, 183],
  '1280': [169, 169, 169, 169, 169, 169, 169],
};

export const columns: Array<ColumnType<StakersRow>> = [
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
    title: titles.totalEigenShares,
    dataIndex: 'totalEigenShares',
    key: 'totalEigenShares',
    render: renderBigNumber,
  },
  {
    title: titles.totalWithdrawalsShares,
    dataIndex: 'totalWithdrawalsShares',
    key: 'totalWithdrawalsShares',
    render: renderBigNumber,
  },
  {
    title: titles.delegatedTo,
    dataIndex: 'delegatedTo',
    key: 'delegatedTo',
    align: 'center',
    render: renderAddressLink('profile'),
  },
  {
    title: titles.lastDelegatedAt,
    dataIndex: 'lastDelegatedAt',
    key: 'lastDelegatedAt',
    align: 'center',
    render: renderDate,
  },
  {
    title: titles.lastUndelegatedAt,
    dataIndex: 'lastUndelegatedAt',
    key: 'lastUndelegatedAt',
    align: 'center',
    render: renderDate,
  },
];

export const transformToCsvRow = ({
  id,
  totalShares,
  totalEigenShares,
  totalWithdrawalsShares,
  delegatedTo,
  lastDelegatedAt,
  lastUndelegatedAt,
}: StakersRow) => ({
  [titles.id]: id,
  [titles.totalShares]: totalShares,
  [titles.totalEigenShares]: totalEigenShares,
  [titles.totalWithdrawalsShares]: totalWithdrawalsShares,
  [titles.delegatedTo]: delegatedTo,
  [titles.lastDelegatedAt]: lastDelegatedAt ? formatTableDate(lastDelegatedAt) : null,
  [titles.lastUndelegatedAt]: lastUndelegatedAt ? formatTableDate(lastUndelegatedAt) : null,
});
