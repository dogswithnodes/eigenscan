'use client';
import { ColumnType } from 'antd/es/table';

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
  shares: number;
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
  '2560': [244, 344, 344, 344, 344, 344],
  '1920': [240, 240, 240, 240, 240, 240],
  '1440': [213, 213, 213, 213, 213, 213],
  '1280': [197, 197, 197, 197, 197, 197],
};

export const columns: Array<ColumnType<StrategyStakesRow>> = [
  {
    title: titles.staker,
    dataIndex: 'staker',
    key: 'staker',
    align: 'center',
    render: renderAddressLink('profile', 'staker-details'),
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
  strategyTotalShares,
}: StrategyStake & {
  balance: string;
  strategyTotalShares: string;
}): StrategyStakesRow => {
  return {
    key: id,
    staker,
    shares: (Number(shares) * Number(balance)) / (Number(strategyTotalShares) * 1e18),
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
