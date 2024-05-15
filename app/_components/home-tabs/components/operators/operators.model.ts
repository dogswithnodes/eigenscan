'use client';
import { ColumnType } from 'antd/es/table';

import { formatTableDate } from '@/app/_utils/table.utils';
import { renderAddressLink, renderDate, renderImage, renderImageGroup } from '@/app/_utils/render.utils';

export type OperatorsRow = {
  key: string;
  id: string;
  logo: string;
  name: string;
  created: string;
  tvl: number;
  delegatorsCount: number;
  avsLogos: Array<string>;
};

const titles: Record<Exclude<keyof OperatorsRow, 'key'>, string> = {
  id: 'Operator',
  name: 'Name',
  logo: 'Img',
  created: 'Created',
  tvl: 'TVL',
  delegatorsCount: 'Delegators count',
  avsLogos: 'AVSs',
};

export const columnsWidth = {
  '2560': [62, 470, 219, 371, 371, 371, 201],
  '1920': [56, 421, 192, 230, 170, 170, 201],
  '1440': [52, 370, 168, 180, 165, 165, 180],
  '1280': [48, 311, 150, 154, 175, 175, 171],
};

export const columns: Array<ColumnType<OperatorsRow>> = [
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
    title: titles.created,
    dataIndex: 'created',
    key: 'created',
    align: 'center',
    render: renderDate,
  },
  {
    title: titles.tvl,
    dataIndex: 'tvl',
    key: 'tvl',
  },
  {
    title: titles.delegatorsCount,
    dataIndex: 'delegatorsCount',
    key: 'delegatorsCount',
  },
  {
    title: titles.avsLogos,
    dataIndex: 'avsLogos',
    key: 'avsLogos',
    render: renderImageGroup,
  },
];

export const transformToCsvRow = ({
  id,
  logo,
  name,
  created,
  delegatorsCount,
  tvl,
  avsLogos,
}: OperatorsRow) => ({
  [titles.id]: id,
  [titles.logo]: logo,
  [titles.name]: name,
  [titles.created]: formatTableDate(created),
  [titles.delegatorsCount]: delegatorsCount,
  [titles.tvl]: tvl.toString(),
  [titles.avsLogos]: avsLogos.join(', '),
});
