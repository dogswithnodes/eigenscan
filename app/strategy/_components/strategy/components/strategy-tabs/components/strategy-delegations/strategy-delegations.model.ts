'use client';
import { ColumnType } from 'antd/es/table';

import { renderAddressLink, renderDate, renderTransactionHash } from '@/app/_utils/render.utils';

export type StrategyDelegation = {
  id: string;
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
  createdTimestamp: string;
  createdTransactionHash: string;
  lastUpdatedTimestamp: string;
  lastUpdatedTransactionHash: string;
};

const titles: Record<Exclude<keyof StrategyDelegationsRow, 'key'>, string> = {
  operator: 'Operator',
  createdTimestamp: 'Created',
  createdTransactionHash: 'Create TX',
  lastUpdatedTimestamp: 'Updated',
  lastUpdatedTransactionHash: 'Update TX',
};

export const columnsWidth = {
  '2560': [344, 344, 344, 344, 344],
  '1920': [240, 240, 240, 240, 240],
  '1440': [213, 213, 213, 213, 213],
  '1280': [197, 197, 197, 197, 197],
};

export const columns: Array<ColumnType<StrategyDelegationsRow>> = [
  {
    title: titles.operator,
    dataIndex: 'operator',
    key: 'operator',
    align: 'center',
    render: renderAddressLink('profile', 'operator-details'),
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
  createdTimestamp,
  createdTransactionHash,
  lastUpdatedTimestamp,
  lastUpdatedTransactionHash,
  operatorStrategy: { operator },
}: StrategyDelegation): StrategyDelegationsRow => {
  return {
    key: id,
    operator: operator.id,
    createdTimestamp,
    createdTransactionHash,
    lastUpdatedTimestamp,
    lastUpdatedTransactionHash,
  };
};

export const transformToCsvRow = ({
  operator,
  createdTimestamp,
  createdTransactionHash,
  lastUpdatedTimestamp,
  lastUpdatedTransactionHash,
}: StrategyDelegationsRow) => ({
  [titles.operator]: operator,
  [titles.createdTimestamp]: renderDate(createdTimestamp),
  [titles.createdTransactionHash]: createdTransactionHash,
  [titles.lastUpdatedTimestamp]: renderDate(lastUpdatedTimestamp),
  [titles.lastUpdatedTransactionHash]: lastUpdatedTransactionHash,
});
