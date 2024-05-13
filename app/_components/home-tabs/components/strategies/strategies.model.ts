'use client';
import { ColumnType } from 'antd/es/table';

import { StrategyEnriched } from '@/app/_models/strategies.model';
import { renderAddressLink, renderBigNumber, renderImage } from '@/app/_utils/render.utils';

export type StrategiesRow = {
  key: string;
  id: string;
  name: string;
  logo: string | null;
  tokenSymbol: string;
  totalShares: number;
  totalDelegated: number;
  stakesCount: number;
  delegationsCount: number;
};

const titles: Record<Exclude<keyof StrategiesRow, 'key'>, string> = {
  id: 'Strategy',
  name: 'Name',
  logo: '',
  tokenSymbol: 'Symbol',
  totalShares: 'Total Shares',
  totalDelegated: 'Total Delegated',
  stakesCount: 'Total stakes',
  delegationsCount: 'Total delegations',
};

export const columnsWidth = {
  '2560': [196, 347, 62, 292, 292, 292, 292, 292],
  '1920': [172, 272, 56, 188, 188, 188, 188, 188],
  '1440': [155, 253, 52, 164, 164, 164, 164, 164],
  '1280': [136, 215, 48, 157, 157, 157, 157, 157],
};

export const columns: Array<ColumnType<StrategiesRow>> = [
  {
    title: titles.id,
    dataIndex: 'id',
    key: 'id',
    align: 'center',
    render: renderAddressLink('strategy'),
  },
  {
    title: titles.name,
    dataIndex: 'name',
    key: 'name',
    onCell: () => ({ className: 'ant-table-cell_left-aligned' }),
  },
  {
    title: titles.logo,
    dataIndex: 'logo',
    key: 'logo',
    render: renderImage,
  },
  {
    title: titles.tokenSymbol,
    dataIndex: 'tokenSymbol',
    key: 'tokenSymbol',
    align: 'center',
  },
  {
    title: titles.totalShares,
    dataIndex: 'totalShares',
    key: 'totalShares',
    render: renderBigNumber,
  },

  {
    title: titles.totalDelegated,
    dataIndex: 'totalDelegated',
    key: 'totalDelegated',
    render: renderBigNumber,
  },
  {
    title: titles.stakesCount,
    dataIndex: 'stakesCount',
    key: 'stakesCount',
  },
  {
    title: titles.delegationsCount,
    dataIndex: 'delegationsCount',
    key: 'delegationsCount',
  },
];

export const transformToRow = ({
  id,
  name,
  tokenSymbol,
  tvl,
  totalDelegated,
  stakesCount,
  delegationsCount,
  logo,
}: StrategyEnriched): StrategiesRow => {
  return {
    key: id,
    id,
    name,
    logo: logo || null,
    tokenSymbol,
    totalShares: Number(BigInt(tvl) / BigInt(1e18)),
    totalDelegated: Number(BigInt(totalDelegated) / BigInt(1e18)),
    stakesCount,
    delegationsCount,
  };
};

export const transformToCsvRow = ({
  id,
  name,
  tokenSymbol,
  totalShares,
  totalDelegated,
  stakesCount,
  delegationsCount,
}: StrategiesRow) => ({
  [titles.id]: id,
  [titles.name]: name,
  [titles.tokenSymbol]: tokenSymbol,
  [titles.totalShares]: totalShares,
  [titles.totalDelegated]: totalDelegated,
  [titles.stakesCount]: stakesCount,
  [titles.delegationsCount]: delegationsCount,
});
