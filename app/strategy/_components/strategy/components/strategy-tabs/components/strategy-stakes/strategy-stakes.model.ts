'use client';
import { ColumnType } from 'antd/es/table';

import { PROFILE_TABLES } from '@/app/_constants/tables.constants';
import { mulDiv } from '@/app/_utils/big-number.utils';
import {
  renderAddressLink,
  renderBigNumber,
  renderDate,
  renderTransactionHash,
} from '@/app/_utils/render.utils';

export type StrategyStake = {
  id: string;
  shares: string;
  createdTimestamp: string;
  createdTransactionHash: string;
  lastUpdatedTimestamp: string;
  lastUpdatedTransactionHash: string;
  depositor: {
    id: string;
  };
};

export type StrategyStakesRow = {
  key: string;
  staker: string;
  shares: string;
  createdTimestamp: string;
  createdTransactionHash: string;
  lastUpdatedTimestamp: string;
  lastUpdatedTransactionHash: string;
};

const titles: Record<Exclude<keyof StrategyStakesRow, 'key'>, string> = {
  staker: 'Staker',
  shares: 'Shares',
  createdTimestamp: 'Created',
  createdTransactionHash: 'Create TX',
  lastUpdatedTimestamp: 'Updated',
  lastUpdatedTransactionHash: 'Update TX',
};

export const columnsWidth = {
  '2560': [344, 344, 343, 343, 343, 344],
  '1920': [240, 239, 239, 239, 239, 240],
  '1440': [213, 213, 212, 212, 213, 213],
  '1280': [197, 197, 197, 197, 197, 197],
};

export const columns: Array<ColumnType<StrategyStakesRow>> = [
  {
    title: titles.staker,
    dataIndex: 'staker',
    key: 'staker',
    align: 'center',
    render: renderAddressLink('profile', PROFILE_TABLES.staker.details),
  },
  {
    title: titles.shares,
    dataIndex: 'shares',
    key: 'shares',
    render: renderBigNumber,
  },
  {
    title: titles.createdTimestamp,
    dataIndex: 'createdTimestamp',
    key: 'createdTimestamp',
    align: 'center',
    render: renderDate,
  },
  {
    title: titles.createdTransactionHash,
    dataIndex: 'createdTransactionHash',
    key: 'createdTransactionHash',
    align: 'center',
    render: renderTransactionHash,
  },
  {
    title: titles.lastUpdatedTimestamp,
    dataIndex: 'lastUpdatedTimestamp',
    key: 'lastUpdatedTimestamp',
    render: renderDate,
  },
  {
    title: titles.lastUpdatedTransactionHash,
    dataIndex: 'lastUpdatedTransactionHash',
    key: 'lastUpdatedTransactionHash',
    align: 'center',
    render: renderTransactionHash,
  },
];

export const transformToRow = ({
  id,
  shares,
  createdTimestamp,
  createdTransactionHash,
  lastUpdatedTimestamp,
  lastUpdatedTransactionHash,
  depositor: { id: staker },
  balance,
  totalSharesAndWithdrawing,
}: StrategyStake & {
  balance: string;
  totalSharesAndWithdrawing: string;
}): StrategyStakesRow => {
  return {
    key: id,
    staker,
    shares: mulDiv(shares, balance, totalSharesAndWithdrawing).toFixed(),
    createdTimestamp,
    createdTransactionHash,
    lastUpdatedTimestamp,
    lastUpdatedTransactionHash,
  };
};

export const transformToCsvRow = ({
  staker,
  shares,
  createdTimestamp,
  createdTransactionHash,
  lastUpdatedTimestamp,
  lastUpdatedTransactionHash,
}: StrategyStakesRow) => ({
  [titles.staker]: staker,
  [titles.shares]: shares,
  [titles.createdTimestamp]: renderDate(createdTimestamp),
  [titles.createdTransactionHash]: createdTransactionHash,
  [titles.lastUpdatedTimestamp]: renderDate(lastUpdatedTimestamp),
  [titles.lastUpdatedTransactionHash]: lastUpdatedTransactionHash,
});
