'use client';
import { ColumnType } from 'antd/es/table';

import { Strategy } from '@/app/_models/strategies.model';
import { renderAddressLink, renderBigNumber, renderImage } from '@/app/_utils/render.utils';

export type StrategiesRow = {
  key: string;
  id: string;
  name: string;
  logo: string | null;
  tokenSymbol: string;
  tvlEth: number;
  balance: number;
  totalDelegated: number;
  stakesCount: number;
  delegationsCount: number;
};

const titles: Record<Exclude<keyof StrategiesRow, 'key'>, string> = {
  id: 'Strategy',
  name: 'Name',
  logo: '',
  tokenSymbol: 'Symbol',
  tvlEth: 'TVL ETH',
  balance: 'Total staked',
  totalDelegated: 'Total Delegated',
  stakesCount: 'Total stakes',
  delegationsCount: 'Total delegations',
};

export const columnsWidth = {
  '2560': [62, 196, 351, 242, 242, 242, 242, 242, 242],
  '1920': [56, 172, 272, 156, 156, 156, 156, 156, 156],
  '1440': [52, 155, 253, 136, 136, 136, 136, 136, 136],
  '1280': [48, 136, 215, 130, 130, 130, 130, 130, 130],
};

export const columns: Array<ColumnType<StrategiesRow>> = [
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
    render: renderAddressLink('strategy'),
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
    title: titles.balance,
    dataIndex: 'balance',
    key: 'balance',
    render: renderBigNumber,
  },
  {
    title: titles.tvlEth,
    dataIndex: 'tvlEth',
    key: 'tvlEth',
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
  balance,
  logo,
}: Strategy): StrategiesRow => {
  return {
    key: id,
    id,
    name,
    logo: logo || null,
    tokenSymbol,
    balance: Number(BigInt(balance) / BigInt(1e18)),
    tvlEth: Number(BigInt(tvl) / BigInt(1e18)),
    totalDelegated: Number(BigInt(totalDelegated) / BigInt(1e18)),
    stakesCount,
    delegationsCount,
  };
};

export const transformToCsvRow = ({
  id,
  name,
  tokenSymbol,
  tvlEth,
  totalDelegated,
  stakesCount,
  delegationsCount,
}: StrategiesRow) => ({
  [titles.id]: id,
  [titles.name]: name,
  [titles.tokenSymbol]: tokenSymbol,
  [titles.tvlEth]: tvlEth,
  [titles.totalDelegated]: totalDelegated,
  [titles.stakesCount]: stakesCount,
  [titles.delegationsCount]: delegationsCount,
});
