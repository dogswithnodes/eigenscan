'use client';
import { ColumnType } from 'antd/es/table';

import { StakerStake } from '../../../../profile.model';

import { StrategyEnriched, StrategyToEthBalance } from '@/app/_models/strategies.model';
import { renderBigNumber, renderDate, renderImage } from '@/app/_utils/render.utils';
import { calculateTotalAssets, toEth } from '@/app/_utils/big-number.utils';

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
  '2560': [62, 334, 333, 333, 333, 333, 333],
  '1920': [56, 230, 230, 230, 230, 230, 230],
  '1440': [52, 204, 204, 204, 204, 204, 204],
  '1280': [48, 189, 189, 189, 189, 189, 189],
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
    align: 'center',
    render: renderDate,
  },
  {
    title: titles.updated,
    dataIndex: 'updated',
    key: 'updated',
    align: 'center',
    render: renderDate,
  },
];

export const transformToRow =
  (strategies: Array<StrategyEnriched>, strategyToEthBalance: StrategyToEthBalance) =>
  ({
    id: key,
    shares,
    createdTimestamp,
    lastUpdatedTimestamp,
    strategy: stakeStrategy,
    withdrawal,
  }: StakerStake): StakerStakesRow => {
    const strategy = strategies.find(({ id }) => id === stakeStrategy.id);
    if (!strategy) throw `Invalid stake strategy id: ${stakeStrategy.id}`;

    const { logo, tokenSymbol, totalShares, balance } = strategy;
    const strategyEthBalance = strategyToEthBalance[strategy.id];
    const strategyTotalShares = strategy.totalShares;

    return {
      key,
      logo: logo || null,
      tokenSymbol,
      created: createdTimestamp,
      updated: lastUpdatedTimestamp,
      lstBalance: Number(toEth(calculateTotalAssets(shares, balance, totalShares))),
      ethBalance: Number(toEth(calculateTotalAssets(shares, strategyEthBalance, strategyTotalShares))),
      withdrawingAmount: withdrawal
        ? Number(toEth(calculateTotalAssets(withdrawal.share, strategyEthBalance, strategyTotalShares)))
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
