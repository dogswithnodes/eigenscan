'use client';
import { ColumnType } from 'antd/es/table';

import { renderAddressLink, renderBigNumber, renderImage } from '@/app/_utils/render.utils';

export type StrategyOperator = {
  operator: {
    id: string;
    metadataURI: string | null;
  };
  totalShares: string;
  delegationsCount: number;
};

export type StrategyOperatorsRow = {
  key: string;
  id: string;
  logo: string | null;
  name: string;
  totalShares: number;
  delegationsCount: number;
};

const titles: Record<Exclude<keyof StrategyOperatorsRow, 'key'>, string> = {
  logo: 'Img',
  name: 'Name',
  id: 'Operator',
  totalShares: 'Total shares',
  delegationsCount: 'Delegations count',
};

export const columnsWidth = {
  '2560': [62, 344, 344, 344, 344, 344],
  '1920': [56, 240, 240, 240, 240, 240],
  '1440': [52, 213, 213, 213, 213, 213],
  '1280': [48, 197, 197, 197, 197, 197],
};

export const columns: Array<ColumnType<StrategyOperatorsRow>> = [
  {
    title: titles.logo,
    dataIndex: 'logo',
    key: 'logo',
    render: renderImage,
  },
  {
    title: titles.name,
    dataIndex: 'name',
    key: 'name',
    onCell: () => ({ className: 'ant-table-cell_left-aligned' }),
  },
  {
    title: titles.id,
    dataIndex: 'id',
    key: 'id',
    align: 'center',
    render: renderAddressLink('profile', 'operator-details' /** TODO const */),
  },
  {
    title: titles.totalShares,
    dataIndex: 'totalShares',
    key: 'totalShares',
    render: renderBigNumber,
  },
  {
    title: titles.delegationsCount,
    dataIndex: 'delegationsCount',
    key: 'delegationsCount',
  },
];

export const transformToRow = ({
  operator: { id },
  logo,
  name,
  totalShares,
  delegationsCount,
  balance,
  strategyTotalShares,
}: StrategyOperator & {
  logo: string | null;
  name: string;
  balance: string;
  strategyTotalShares: string;
}): StrategyOperatorsRow => {
  return {
    key: id,
    id,
    logo,
    name,
    totalShares: (Number(totalShares) * Number(balance)) / (Number(strategyTotalShares) * 1e18),
    delegationsCount,
  };
};

export const transformToCsvRow = ({
  logo,
  name,
  id,
  totalShares,
  delegationsCount,
}: StrategyOperatorsRow) => ({
  [titles.logo]: logo,
  [titles.name]: name,
  [titles.id]: id,
  [titles.totalShares]: totalShares,
  [titles.delegationsCount]: delegationsCount,
});
