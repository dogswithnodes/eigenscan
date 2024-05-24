'use client';
import { ColumnType } from 'antd/es/table';

import { AVSOperator } from '../../../../../../avs.model';

import { BN_ZERO } from '@/app/_constants/big-number.constants';
import { StrategyToEthBalance } from '@/app/_models/strategies.model';
import { mulDiv } from '@/app/_utils/big-number.utils';
import { renderAddressLink, renderBigNumber, renderImage } from '@/app/_utils/render.utils';
import { ProtocolEntityMetadata } from '@/app/_models/protocol-entity-metadata.model';

export type Registration = {
  operator: AVSOperator['operator'] & {
    metadataURI: string | null;
  };
};

export type RegistrationsRow = {
  operator__id: string;
  key: string;
  logo: string;
  name: string;
  operator__totalShares: string;
  operator__totalEigenShares: string;
};

const titles: Record<Exclude<keyof RegistrationsRow, 'key'>, string> = {
  logo: 'Img',
  name: 'Name',
  operator__id: 'Operator',
  operator__totalShares: 'TVL ETH',
  operator__totalEigenShares: 'TVL Eigen',
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
    title: titles.operator__id,
    dataIndex: 'operator__id',
    key: 'operator__id',
    align: 'center',
    render: renderAddressLink('profile', 'operator-details'),
  },
  {
    title: titles.operator__totalShares,
    dataIndex: 'operator__totalShares',
    key: 'operator__totalShares',
    render: renderBigNumber,
  },
  {
    title: titles.operator__totalEigenShares,
    dataIndex: 'operator__totalEigenShares',
    key: 'operator__totalEigenShares',
    render: renderBigNumber,
  },
];

export const transformToRow = (
  { operator: { id, totalEigenShares, strategies } }: Registration,
  { logo, name }: ProtocolEntityMetadata,
  strategyToEthBalance: StrategyToEthBalance,
): RegistrationsRow => {
  const tvl = strategies.reduce((tvl, { totalShares, strategy }) => {
    tvl = tvl.plus(mulDiv(totalShares, strategyToEthBalance[strategy.id], strategy.totalShares));

    return tvl;
  }, BN_ZERO);

  return {
    key: id,
    operator__id: id,
    logo,
    name,
    operator__totalEigenShares: totalEigenShares,
    operator__totalShares: tvl.toFixed(),
  };
};

export const transformToCsvRow = ({
  operator__id,
  logo,
  name,
  operator__totalShares,
  operator__totalEigenShares,
}: RegistrationsRow) => ({
  [titles.operator__id]: operator__id,
  [titles.logo]: logo,
  [titles.name]: name,
  [titles.operator__totalShares]: operator__totalShares,
  [titles.operator__totalEigenShares]: operator__totalEigenShares,
});
