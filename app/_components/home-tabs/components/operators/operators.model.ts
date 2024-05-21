'use client';
import { ColumnType } from 'antd/es/table';

import { BN_ZERO } from '@/app/_constants/big-number.constants';
import { StrategyToEthBalance } from '@/app/_models/strategies.model';
import { calculateTotalAssets, toEth } from '@/app/_utils/big-number.utils';
import { formatTableDate } from '@/app/_utils/table.utils';
import {
  renderAddressLink,
  renderBigNumber,
  renderDate,
  renderImage,
  renderImageGroup,
} from '@/app/_utils/render.utils';

export type Operator = {
  id: string;
  delegatorsCount: number;
  registered: string;
  metadataURI: string | null;
  strategies: Array<{
    totalShares: string;
    strategy: {
      id: string;
      totalShares: string;
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
  strategyToEthBalance: StrategyToEthBalance,
): OperatorsRow => {
  const tvl = strategies.reduce((acc, { totalShares, strategy }) => {
    return acc.plus(
      calculateTotalAssets(totalShares, strategyToEthBalance[strategy.id], strategy.totalShares),
    );
  }, BN_ZERO);

  return {
    key: id,
    id,
    logo,
    name,
    // TODO bn
    tvl: Number(toEth(tvl)),
    created: registered,
    delegatorsCount,
    avsLogos,
  };
};

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
  [titles.tvl]: tvl,
  [titles.avsLogos]: avsLogos.join(', '),
});
