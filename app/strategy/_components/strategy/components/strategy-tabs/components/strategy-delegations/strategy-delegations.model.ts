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

export type StrategyDelegation = {
  id: string;
  shares: string;
  createdTimestamp: string;
  lastUpdatedTimestamp: string;
  lastUpdatedTransactionHash: string;
  createdTransactionHash: string;
  operatorStrategy: {
    operator: {
      id: string;
    };
  };
};

export type StrategyDelegationsRow = {
  key: string;
  operator: string;
  shares: string;
  createdTimestamp: string;
  createdTransactionHash: string;
  lastUpdatedTimestamp: string;
  lastUpdatedTransactionHash: string;
};

const titles: Record<Exclude<keyof StrategyDelegationsRow, 'key'>, string> = {
  operator: 'Operator',
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

export const columns: Array<ColumnType<StrategyDelegationsRow>> = [
  {
    title: titles.operator,
    dataIndex: 'operator',
    key: 'operator',
    align: 'center',
    render: renderAddressLink('profile', PROFILE_TABLES.operator.details),
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
  operatorStrategy: { operator },
  balance,
  totalSharesAndWithdrawing,
}: StrategyDelegation & {
  balance: string;
  totalSharesAndWithdrawing: string;
}): StrategyDelegationsRow => {
  return {
    key: id,
    operator: operator.id,
    shares: mulDiv(shares, balance, totalSharesAndWithdrawing).toFixed(),
    createdTimestamp,
    createdTransactionHash,
    lastUpdatedTimestamp,
    lastUpdatedTransactionHash,
  };
};

export const transformToCsvRow = ({
  operator,
  shares,
  createdTimestamp,
  createdTransactionHash,
  lastUpdatedTimestamp,
  lastUpdatedTransactionHash,
}: StrategyDelegationsRow) => ({
  [titles.operator]: operator,
  [titles.shares]: shares,
  [titles.createdTimestamp]: renderDate(createdTimestamp),
  [titles.createdTransactionHash]: createdTransactionHash,
  [titles.lastUpdatedTimestamp]: renderDate(lastUpdatedTimestamp),
  [titles.lastUpdatedTransactionHash]: lastUpdatedTransactionHash,
});
