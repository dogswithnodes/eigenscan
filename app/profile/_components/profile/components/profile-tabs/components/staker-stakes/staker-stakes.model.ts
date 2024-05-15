'use client';
import { ColumnType } from 'antd/es/table';

import { StakerStaker } from '../../../../profile.model';

import { Strategy } from '@/app/_models/strategies.model';
import { renderBigNumber, renderDate, renderImage } from '@/app/_utils/render.utils';
import { StrategyToTvlMap } from '@/app/_utils/strategies.utils';

export type StakerStakesRow = {
  key: string;
  logo: string | null;
  tokenSymbol: string;
  lstBalance: number;
  ethBalance: number;
  withdrawingAmount: number;
  created: string;
  updated: string;
};

const titles: Record<Exclude<keyof StakerStakesRow, 'key'>, string> = {
  logo: 'Img',
  tokenSymbol: 'Token symbol',
  lstBalance: 'Balance',
  ethBalance: 'Balance ETH',
  withdrawingAmount: 'Withdrawing Amount',
  created: 'Created At',
  updated: 'Updated At',
};

export const columnsWidth = {
  '2560': [62, 347, 292, 292, 292, 292, 292],
  '1920': [56, 272, 188, 188, 188, 188, 188],
  '1440': [52, 253, 164, 164, 164, 164, 164],
  '1280': [48, 215, 157, 157, 157, 157, 157],
};

export const columns: Array<ColumnType<StakerStakesRow>> = [
  {
    title: titles.logo,
    dataIndex: 'logo',
    key: 'logo',
    render: renderImage,
  },
  {
    title: titles.tokenSymbol,
    dataIndex: 'tokenSymbol',
    key: 'tokenSymbol',
    align: 'center',
  },
  {
    title: titles.lstBalance,
    dataIndex: 'lstBalance',
    key: 'lstBalance',
    render: renderBigNumber,
  },
  {
    title: titles.ethBalance,
    dataIndex: 'ethBalance',
    key: 'ethBalance',
    render: renderBigNumber,
  },
  {
    title: titles.withdrawingAmount,
    dataIndex: 'withdrawingAmount',
    key: 'withdrawingAmount',
    render: renderBigNumber,
  },
  {
    title: titles.created,
    dataIndex: 'created',
    key: 'created',
    render: renderDate,
  },
  {
    title: titles.updated,
    dataIndex: 'updated',
    key: 'updated',
    render: renderDate,
  },
];

export const transformToRow =
  (strategies: Array<Strategy>, strategyToTvl: StrategyToTvlMap) =>
  ({
    id: key,
    shares,
    createdTimestamp,
    lastUpdatedTimestamp,
    strategy: stakeStrategy,
    withdrawal,
  }: StakerStaker): StakerStakesRow => {
    const strategy = strategies.find(({ id }) => id === stakeStrategy.id);
    if (!strategy) throw `Invalid stake strategy id: ${stakeStrategy.id}`;

    const { logo, tokenSymbol, totalShares, balance } = strategy;

    return {
      key,
      logo: logo || null,
      tokenSymbol,
      created: createdTimestamp,
      updated: lastUpdatedTimestamp,
      lstBalance: (Number(shares) * Number(balance)) / (Number(totalShares) * Number(1e18)),
      ethBalance: (Number(shares) * Number(strategyToTvl[strategy.id])) / Number(strategy.totalShares) / 1e18,
      withdrawingAmount: withdrawal
        ? Number(
            (Number(withdrawal.share) * Number(strategyToTvl[strategy.id])) / Number(strategy.totalShares),
          ) / 1e18
        : 0,
    };
  };

export const transformToCsvRow = ({
  logo,
  tokenSymbol,
  lstBalance,
  ethBalance,
  withdrawingAmount,
  created,
  updated,
}: StakerStakesRow) => ({
  [titles.logo]: logo,
  [titles.tokenSymbol]: tokenSymbol,
  [titles.lstBalance]: lstBalance,
  [titles.ethBalance]: ethBalance,
  [titles.withdrawingAmount]: withdrawingAmount,
  [titles.created]: renderDate(created),
  [titles.updated]: renderDate(updated),
});
