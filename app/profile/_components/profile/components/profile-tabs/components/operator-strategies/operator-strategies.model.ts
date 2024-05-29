'use client';
import { ColumnType } from 'antd/es/table';
import BigNumber from 'bignumber.js';

import { StrategiesMapEnriched } from '@/app/_models/strategies.model';
import { mulDiv } from '@/app/_utils/big-number.utils';
import { renderAddressLink, renderBigNumber, renderImage } from '@/app/_utils/render.utils';

export type OperatorStrategy = {
  totalShares: string;
  strategy: {
    id: string;
  };
};

export type OperatorStrategiesRow = {
  key: string;
  id: string;
  name: string;
  logo: string | null;
  tokenSymbol: string;
  totalDelegated: BigNumber;
};

const titles: Record<Exclude<keyof OperatorStrategiesRow, 'key'>, string> = {
  id: 'Strategy',
  name: 'Name',
  logo: '',
  tokenSymbol: 'Symbol',
  totalDelegated: 'Total Delegated',
};

export const columnsWidth = {
  '2560': [65, 499, 499, 499, 499],
  '1920': [56, 345, 345, 345, 345],
  '1440': [52, 306, 306, 306, 306],
  '1280': [50, 283, 283, 283, 283],
};

export const columns: Array<ColumnType<OperatorStrategiesRow>> = [
  {
    title: titles.logo,
    dataIndex: 'logo',
    key: 'logo',
    render: renderImage,
  },
  {
    title: titles.id,
    dataIndex: 'id',
    key: 'id',
    align: 'center',
    render: renderAddressLink('strategy', 'strategy-details'),
  },
  {
    title: titles.name,
    dataIndex: 'name',
    key: 'name',
    onCell: () => ({ className: 'ant-table-cell_left-aligned' }),
  },
  {
    title: titles.tokenSymbol,
    dataIndex: 'tokenSymbol',
    key: 'tokenSymbol',
    align: 'center',
  },
  {
    title: titles.totalDelegated,
    dataIndex: 'totalDelegated',
    key: 'totalDelegated',
    render: renderBigNumber,
  },
];

export const transformToRow = (
  { totalShares, strategy }: OperatorStrategy,
  strategiesMap: StrategiesMapEnriched,
): OperatorStrategiesRow => {
  const { id, logo, name, tokenSymbol, balance, totalSharesAndWithdrawing } = strategiesMap[strategy.id];

  return {
    key: id,
    id,
    name,
    logo: logo || null,
    tokenSymbol,
    totalDelegated: mulDiv(totalShares, balance, totalSharesAndWithdrawing),
  };
};

export const transformToCsvRow = ({
  id,
  name,
  logo,
  tokenSymbol,
  totalDelegated,
}: OperatorStrategiesRow) => ({
  [titles.id]: id,
  [titles.name]: name,
  [titles.logo]: logo,
  [titles.tokenSymbol]: tokenSymbol,
  [titles.totalDelegated]: totalDelegated,
});
