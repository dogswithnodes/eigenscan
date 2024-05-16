'use client';
import { ColumnType } from 'antd/es/table';

import { AVS } from './avss.service';

import { renderAddressLink, renderBigNumber, renderDate, renderImage } from '@/app/_utils/render.utils';
import { formatTableDate } from '@/app/_utils/table.utils';

export type AVSsRow = {
  key: string;
  id: string;
  logo: string;
  name: string;
  created: string;
  ethTvl: number;
  eigenTvl: number;
  operatorsCount: number;
};

const titles: Record<Exclude<keyof AVSsRow, 'key'>, string> = {
  id: 'AVS',
  name: 'Name',
  logo: 'Img',
  created: 'Created',
  ethTvl: 'TVL ETH',
  eigenTvl: 'TVL EIGEN',
  operatorsCount: 'Operators count',
};

export const columnsWidth = {
  '2560': [62, 196, 524, 225, 352, 352, 352],
  '1920': [56, 172, 372, 200, 212, 212, 212],
  '1440': [52, 155, 339, 175, 185, 185, 185],
  '1280': [48, 136, 300, 152, 182, 182, 182],
};

export const columns: Array<ColumnType<AVSsRow>> = [
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
    render: renderAddressLink('avs'),
  },
  {
    title: titles.name,
    dataIndex: 'name',
    key: 'name',
    onCell: () => ({ className: 'ant-table-cell_left-aligned' }),
  },

  {
    title: titles.created,
    dataIndex: 'created',
    key: 'created',
    align: 'center',
    render: renderDate,
  },
  {
    title: titles.ethTvl,
    dataIndex: 'ethTvl',
    key: 'ethTvl',
    render: renderBigNumber,
  },
  {
    title: titles.eigenTvl,
    dataIndex: 'eigenTvl',
    key: 'eigenTvl',
    render: renderBigNumber,
  },
  {
    title: titles.operatorsCount,
    dataIndex: 'operatorsCount',
    key: 'operatorsCount',
  },
];

export const transformToRow = ({
  id,
  name,
  logo,
  registrationsCount,
  ethTvl,
  eigenTvl,
  created,
}: AVS): AVSsRow => {
  return {
    key: id,
    id,
    name,
    logo,
    operatorsCount: registrationsCount,
    ethTvl: Number(BigInt(ethTvl) / BigInt(1e18)),
    eigenTvl: Number(BigInt(eigenTvl) / BigInt(1e18)),
    created,
  };
};

export const transformToCsvRow = ({
  id,
  logo,
  name,
  created,
  ethTvl,
  eigenTvl,
  operatorsCount,
}: AVSsRow) => ({
  [titles.logo]: logo,
  [titles.id]: id,
  [titles.name]: name,
  [titles.created]: formatTableDate(created),
  [titles.ethTvl]: ethTvl,
  [titles.ethTvl]: eigenTvl,
  [titles.operatorsCount]: operatorsCount,
});
