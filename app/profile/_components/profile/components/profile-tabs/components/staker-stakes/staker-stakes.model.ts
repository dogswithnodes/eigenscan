'use client';
import { ColumnType } from 'antd/es/table';
import BigNumber from 'bignumber.js';

import { StakerStake } from '../../../../profile.model';

import { BN_ZERO } from '@/app/_constants/big-number.constants';
import { StrategiesMapEnriched } from '@/app/_models/strategies.model';
import { mulDiv } from '@/app/_utils/big-number.utils';
import { renderBigNumber, renderDate, renderImage } from '@/app/_utils/render.utils';

export type StakerStakesRow = {
  key: string;
  logo: string | null;
  tokenSymbol: string;
  lstBalance: BigNumber;
  ethBalance: BigNumber;
  withdrawingAmount: BigNumber;
  created: string;
  updated: string;
};

const titles: Record<Exclude<keyof StakerStakesRow, 'key'>, string> = {
  logo: 'Img',
  tokenSymbol: 'Token symbol',
  lstBalance: 'Balance',
  ethBalance: 'Balance ETH',
  withdrawingAmount: 'Withdrawing Amount ETH',
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
    onCell: () => ({ className: 'ant-table-cell_img' }),
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
  (strategiesMap: StrategiesMapEnriched) =>
  ({
    id: key,
    shares,
    createdTimestamp,
    lastUpdatedTimestamp,
    strategy,
    withdrawal,
  }: StakerStake): StakerStakesRow => {
    const { logo, tokenSymbol, ethBalance, balance, totalSharesAndWithdrawing } = strategiesMap[strategy.id];

    return {
      key,
      logo: logo || null,
      tokenSymbol,
      created: createdTimestamp,
      updated: lastUpdatedTimestamp,
      lstBalance: mulDiv(shares, balance, totalSharesAndWithdrawing),
      ethBalance: mulDiv(shares, ethBalance, totalSharesAndWithdrawing),
      withdrawingAmount: withdrawal
        ? mulDiv(withdrawal.share, ethBalance, totalSharesAndWithdrawing)
        : BN_ZERO,
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
