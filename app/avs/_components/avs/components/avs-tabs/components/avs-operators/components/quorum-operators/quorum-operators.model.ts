'use client';
import { ColumnType } from 'antd/es/table';

import { renderTotalWeight } from './quorum-operators.utils';

import { AVSOperator } from '../../../../../../avs.model';

import { BN_ZERO } from '@/app/_constants/big-number.constants';
import { ProtocolEntityMetadata } from '@/app/_models/protocol-entity-metadata.model';
import { StrategyToEthBalance } from '@/app/_models/strategies.model';
import { mulDiv } from '@/app/_utils/big-number.utils';
import { renderAddressLink, renderBigNumber, renderImage } from '@/app/_utils/render.utils';

export type QuorumOperator = {
  operator: AVSOperator['operator'] & {
    metadataURI: string | null;
  };
  totalWeight: string;
};

export type QuorumOperatorsRow = {
  operator__id: string;
  key: string;
  logo: string;
  name: string;
  operator__totalShares: string;
  operator__totalEigenShares: string;
  totalWeight: string;
  quorumWeight: string;
};

const titles: Record<Exclude<keyof QuorumOperatorsRow, 'key' | 'quorumWeight'>, string> = {
  logo: 'Img',
  name: 'Name',
  operator__id: 'Operator',
  operator__totalShares: 'TVL ETH',
  operator__totalEigenShares: 'TVL Eigen',
  totalWeight: 'Total Weight',
};

export const columnsWidth = {
  '2560': [66, 399, 399, 399, 399, 399],
  '1920': [56, 276, 276, 276, 276, 276],
  '1440': [56, 244, 244, 244, 244, 244],
  '1280': [52, 226, 226, 226, 226, 226],
};

export const columns: Array<ColumnType<QuorumOperatorsRow>> = [
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
  {
    title: titles.totalWeight,
    dataIndex: 'totalWeight',
    key: 'totalWeight',
    render: renderTotalWeight,
  },
];

export const transformToRow = (
  operator: QuorumOperator,
  { logo, name }: ProtocolEntityMetadata,
  strategyToEthBalance: StrategyToEthBalance,
  quorumWeight: string,
): QuorumOperatorsRow => {
  const {
    operator: { id, totalEigenShares, strategies },
  } = operator;

  const tvl = strategies.reduce((tvl, { totalShares, strategy }) => {
    tvl = tvl.plus(mulDiv(totalShares, strategyToEthBalance[strategy.id], strategy.totalShares));

    return tvl;
  }, BN_ZERO);

  return {
    key: id,
    operator__id: id,
    logo,
    name,
    totalWeight: operator.totalWeight,
    quorumWeight,
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
  totalWeight,
}: QuorumOperatorsRow) => ({
  [titles.operator__id]: operator__id,
  [titles.logo]: logo,
  [titles.name]: name,
  [titles.operator__totalShares]: operator__totalShares,
  [titles.operator__totalEigenShares]: operator__totalEigenShares,
  [titles.totalWeight]: totalWeight,
});
