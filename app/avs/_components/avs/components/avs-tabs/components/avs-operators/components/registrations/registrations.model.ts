'use client';
import { ColumnType } from 'antd/es/table';

import { AVSOperator } from '../../../../../../avs.model';

import { BN_ZERO } from '@/app/_constants/big-number.constants';
import { StrategyToEthBalance } from '@/app/_models/strategies.model';
import { mulDiv } from '@/app/_utils/big-number.utils';
import { renderAddressLink, renderBigNumber, renderImage } from '@/app/_utils/render.utils';
import { ProtocolEntityMetadata } from '@/app/_models/protocol-entity-metadata.model';

export type Registration = AVSOperator['operator'] & {
  metadataURI: string | null;
};

export type RegistrationsRow = {
  id: string;
  key: string;
  logo: string;
  name: string;
  totalShares: string;
  totalEigenShares: string;
};

const titles: Record<Exclude<keyof RegistrationsRow, 'key'>, string> = {
  logo: 'Img',
  name: 'Name',
  id: 'Operator',
  totalShares: 'TVL ETH',
  totalEigenShares: 'TVL Eigen',
};

export const columnsWidth = {
  '2560': [65, 499, 499, 499, 499],
  '1920': [56, 345, 345, 345, 345],
  '1440': [52, 306, 306, 306, 306],
  '1280': [50, 283, 283, 283, 283],
};

export const columns: Array<ColumnType<RegistrationsRow>> = [
  {
    title: titles.logo,
    dataIndex: 'logo',
    key: 'logo',
    align: 'center',
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
    render: renderAddressLink('profile', 'operator-details'),
  },
  {
    title: titles.totalShares,
    dataIndex: 'totalShares',
    key: 'totalShares',
    render: renderBigNumber,
  },
  {
    title: titles.totalEigenShares,
    dataIndex: 'totalEigenShares',
    key: 'totalEigenShares',
    render: renderBigNumber,
  },
];

export const transformToRow = (
  { id, totalEigenShares, strategies }: Registration,
  { logo, name }: ProtocolEntityMetadata,
  strategyToEthBalance: StrategyToEthBalance,
): RegistrationsRow => {
  const tvl = strategies.reduce((tvl, { totalShares, strategy }) => {
    tvl = tvl.plus(mulDiv(totalShares, strategyToEthBalance[strategy.id], strategy.totalShares));

    return tvl;
  }, BN_ZERO);

  return {
    key: id,
    id: id,
    logo,
    name,
    totalEigenShares: totalEigenShares,
    totalShares: tvl.toFixed(),
  };
};

export const transformToCsvRow = ({ id, logo, name, totalShares, totalEigenShares }: RegistrationsRow) => ({
  [titles.id]: id,
  [titles.logo]: logo,
  [titles.name]: name,
  [titles.totalShares]: totalShares,
  [titles.totalEigenShares]: totalEigenShares,
});
