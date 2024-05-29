'use client';
import { ColumnType } from 'antd/es/table';
import type BigNumber from 'bignumber.js';

import { BN_ZERO } from '@/app/_constants/big-number.constants';
import { StrategiesMap } from '@/app/_models/strategies.model';
import { mulDiv } from '@/app/_utils/big-number.utils';
import {
  renderAddressLink,
  renderBigNumber,
  renderDate,
  renderImage,
  renderImageGroup,
} from '@/app/_utils/render.utils';
import { formatTableDate } from '@/app/_utils/table.utils';

export type Operator = {
  id: string;
  delegatorsCount: number;
  registered: string;
  metadataURI: string | null;
  strategies: Array<{
    totalShares: string;
    strategy: {
      id: string;
    };
  }>;
  avsStatuses: Array<{
    avs: {
      id: string;
      metadataURI: string | null;
    };
  }>;
};

export type OperatorEnriched = Operator & {
  avsLogos: Array<string>;
  logo: string;
  name: string;
};

export type OperatorsRow = {
  key: string;
  id: string;
  logo: string;
  name: string;
  registered: string;
  totalShares: BigNumber;
  delegatorsCount: number;
  avsLogos: Array<string>;
};

const titles: Record<Exclude<keyof OperatorsRow, 'key'>, string> = {
  id: 'Operator',
  name: 'Name',
  logo: 'Img',
  registered: 'Created',
  totalShares: 'TVL',
  delegatorsCount: 'Delegators count',
  avsLogos: 'AVSs',
};

export const columnsWidth = {
  '2560': [62, 468, 219, 371, 371, 371, 201],
  '1920': [56, 417, 192, 230, 170, 170, 201],
  '1440': [52, 366, 168, 180, 165, 165, 180],
  '1280': [48, 309, 150, 154, 175, 175, 171],
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
    title: titles.registered,
    dataIndex: 'registered',
    key: 'registered',
    align: 'center',
    render: renderDate,
  },
  {
    title: titles.totalShares,
    dataIndex: 'totalShares',
    key: 'totalShares',
    render: renderBigNumber,
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

export const transformToRow = (
  { id, registered, delegatorsCount, strategies, logo, name, avsLogos }: OperatorEnriched,
  strategiesMap: StrategiesMap,
): OperatorsRow => {
  const tvl = strategies.reduce((acc, { totalShares, strategy }) => {
    const { ethBalance, totalSharesAndWithdrawing } = strategiesMap[strategy.id];

    return acc.plus(mulDiv(totalShares, ethBalance, totalSharesAndWithdrawing));
  }, BN_ZERO);

  return {
    key: id,
    id,
    logo,
    name,
    totalShares: tvl,
    registered,
    delegatorsCount,
    avsLogos,
  };
};

export const transformToCsvRow = ({
  id,
  logo,
  name,
  registered,
  delegatorsCount,
  totalShares,
  avsLogos,
}: OperatorsRow) => ({
  [titles.id]: id,
  [titles.logo]: logo,
  [titles.name]: name,
  [titles.registered]: formatTableDate(registered),
  [titles.delegatorsCount]: delegatorsCount,
  [titles.totalShares]: totalShares,
  [titles.avsLogos]: avsLogos.join(', '),
});
