'use client';
import { ColumnType } from 'antd/es/table';

import { Multiplier } from '../../../../avs.model';

import { StrategyEnriched } from '@/app/_models/strategies.model';
import { renderAddressLink, renderImage } from '@/app/_utils/render.utils';

export type AVSTokensRow = {
  key: string;
  logo: string | null;
  tokenSymbol: string;
  strategy: string;
  strategyName: string;
  multiplier: string;
};

const titles: Record<Exclude<keyof AVSTokensRow, 'key'>, string> = {
  logo: 'Img',
  tokenSymbol: 'Token symbol',
  strategy: 'Strategy',
  strategyName: 'Strategy name',
  multiplier: 'Multiplier',
};

export const columnsWidth = {
  '2560': [65, 499, 499, 499, 499],
  '1920': [56, 345, 345, 345, 345],
  '1440': [52, 306, 306, 306, 306],
  '1280': [50, 283, 283, 283, 283],
};

export const columns: Array<ColumnType<AVSTokensRow>> = [
  {
    title: titles.logo,
    dataIndex: 'logo',
    key: 'logo',
    align: 'center',
    render: renderImage,
  },
  {
    title: titles.tokenSymbol,
    dataIndex: 'tokenSymbol',
    key: 'tokenSymbol',
    align: 'center',
  },
  {
    title: titles.strategy,
    dataIndex: 'strategy',
    key: 'strategy',
    align: 'center',
    render: renderAddressLink('strategy', 'strategy-details'),
  },
  {
    title: titles.strategyName,
    dataIndex: 'strategyName',
    key: 'strategyName',
    onCell: () => ({ className: 'ant-table-cell_left-aligned' }),
  },
  {
    title: titles.multiplier,
    dataIndex: 'multiplier',
    key: 'multiplier',
    align: 'center',
  },
];

export const transformToRows = (
  strategies: Array<StrategyEnriched>,
  multipliers: Array<Multiplier>,
): Array<AVSTokensRow> => {
  const idToStrategy = strategies.reduce<Record<string, StrategyEnriched>>((acc, strategy) => {
    acc[strategy.id] = strategy;
    return acc;
  }, {});

  return multipliers.map(({ id, multiply, strategy }) => {
    const { logo, tokenSymbol, name } = idToStrategy[strategy.id];

    return {
      key: id,
      logo,
      tokenSymbol,
      strategy: strategy.id,
      strategyName: name,
      multiplier: Number(multiply).toFixed(3),
    };
  });
};

export const transformToCsvRow = ({
  logo,
  tokenSymbol,
  strategy,
  strategyName,
  multiplier,
}: AVSTokensRow) => ({
  [titles.logo]: logo,
  [titles.tokenSymbol]: tokenSymbol,
  [titles.strategy]: strategy,
  [titles.strategyName]: strategyName,
  [titles.multiplier]: multiplier,
});
