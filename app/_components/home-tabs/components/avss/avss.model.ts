'use client';
import { ColumnType } from 'antd/es/table';
import type BigNumber from 'bignumber.js';

import { AVSOperatorBase } from '@/app/_models/avs.model';
import { StrategyToEthBalance } from '@/app/_models/strategies.model';
import { calculateAVSTVLs } from '@/app/_utils/avs.utils';
import { renderAddressLink, renderBigNumber, renderDate, renderImage } from '@/app/_utils/render.utils';
import { formatTableDate } from '@/app/_utils/table.utils';

export type AVS = {
  id: string;
  metadataURI: string | null;
  created: string;
  registrationsCount: number;
  quorums: Array<{
    multipliers: Array<{
      strategy: {
        id: string;
      };
    }>;
    operators: Array<AVSOperatorBase>;
    operatorsCount: number;
  }>;
  registrations: Array<AVSOperatorBase>;
};

export type AVSEnriched = AVS & { logo: string; name: string };

export type AVSsRow = {
  key: string;
  id: string;
  logo: string;
  name: string;
  created: string;
  ethTvl: BigNumber;
  eigenTvl: BigNumber;
  registrationsCount: number;
};

const titles: Record<Exclude<keyof AVSsRow, 'key'>, string> = {
  id: 'AVS',
  name: 'Name',
  logo: 'Img',
  created: 'Created',
  ethTvl: 'TVL ETH',
  eigenTvl: 'TVL EIGEN',
  registrationsCount: 'Operators count',
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
    render: renderAddressLink('avs', 'avs-details'),
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
    title: titles.registrationsCount,
    dataIndex: 'registrationsCount',
    key: 'registrationsCount',
  },
];

export const transformToRow = (
  { id, registrationsCount, quorums, registrations, created, logo, name }: AVSEnriched,
  strategyToEthBalance: StrategyToEthBalance,
): AVSsRow => {
  const { ethTvl, eigenTvl } = calculateAVSTVLs(quorums, registrations, strategyToEthBalance);

  return {
    key: id,
    id,
    name,
    logo,
    registrationsCount,
    ethTvl,
    eigenTvl,
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
  registrationsCount,
}: AVSsRow) => ({
  [titles.logo]: logo,
  [titles.id]: id,
  [titles.name]: name,
  [titles.created]: formatTableDate(created),
  [titles.ethTvl]: ethTvl,
  [titles.ethTvl]: eigenTvl,
  [titles.registrationsCount]: registrationsCount,
});
