'use client';
import { ColumnType } from 'antd/es/table';

import { formatTableDate } from '@/app/_utils/table.utils';
import { renderAddressLink, renderDate, renderImage, renderImageGroup } from '@/app/_utils/render.utils';

export type Operator = {
  id: string;
  logo: string;
  name: string;
  created: string;
  stakersCount: number;
  tvl: bigint;
  avsLogos: Array<string>;
};

export type OperatorsRow = {
  key: string;
  id: string;
  logo: string;
  name: string;
  created: string;
  tvl: number;
  stakersCount: number;
  avsLogos: Array<string>;
};

const titles: Record<Exclude<keyof OperatorsRow, 'key'>, string> = {
  id: 'Operator',
  name: 'Name',
  logo: 'Img',
  created: 'Created',
  tvl: 'TVL',
  stakersCount: 'Total stakers',
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
    align: 'left',
  },
  {
    title: titles.id,
    dataIndex: 'id',
    key: 'id',
    align: 'center',
    render: renderAddressLink('profile'),
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
    title: titles.stakersCount,
    dataIndex: 'stakersCount',
    key: 'stakersCount',
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
  stakersCount,
  tvl,
  avsLogos,
}: OperatorsRow) => ({
  [titles.id]: id,
  [titles.logo]: logo,
  [titles.name]: name,
  [titles.created]: formatTableDate(created),
  [titles.stakersCount]: stakersCount,
  [titles.tvl]: tvl.toString(),
  [titles.avsLogos]: avsLogos.join(', '),
});
