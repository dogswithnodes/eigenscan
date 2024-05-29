'use client';
import { ColumnType } from 'antd/es/table';

import { mulDiv } from '@/app/_utils/big-number.utils';
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
  logo: string;
  name: string;
  totalShares: string;
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
  '2560': [65, 499, 499, 499, 499],
  '1920': [56, 345, 345, 345, 345],
  '1440': [52, 306, 306, 306, 306],
  '1280': [48, 283, 283, 283, 283],
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
  totalSharesAndWithdrawing,
}: StrategyOperator & {
  logo: string;
  name: string;
  balance: string;
  totalSharesAndWithdrawing: string;
}): StrategyOperatorsRow => {
  return {
    key: id,
    id,
    logo,
    name,
    totalShares: mulDiv(totalShares, balance, totalSharesAndWithdrawing).toFixed(),
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
