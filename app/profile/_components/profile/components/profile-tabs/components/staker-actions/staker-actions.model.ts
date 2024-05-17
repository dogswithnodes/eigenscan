'use client';
import { ColumnType } from 'antd/es/table';

import { StakerAction } from '../../../../profile.model';

import { BaseActionsRow } from '@/app/_models/actions.model';
import { renderDate, renderTransactionHash } from '@/app/_utils/render.utils';

export type StakerActionsRow = BaseActionsRow;

const titles: Record<Exclude<keyof BaseActionsRow, 'key'>, string> = {
  blockNumber: 'Block Number',
  blockTimestamp: 'Date time',
  type: 'Type',
  transactionHash: 'Transaction hash',
};

export const columnsWidth = {
  '2560': [516, 515, 515, 515],
  '1920': [359, 359, 359, 359],
  '1440': [319, 319, 319, 319],
  '1280': [296, 296, 295, 295],
};

export const columns: Array<ColumnType<BaseActionsRow>> = [
  {
    title: titles.blockTimestamp,
    dataIndex: 'blockTimestamp',
    key: 'blockTimestamp',
    align: 'center',
    render: renderDate,
    width: '25%',
  },
  {
    title: titles.blockNumber,
    dataIndex: 'blockNumber',
    key: 'blockNumber',
    align: 'center',
    width: '25%',
  },
  {
    title: titles.type,
    dataIndex: 'type',
    key: 'type',
    align: 'center',
    width: '25%',
  },
  {
    title: titles.transactionHash,
    dataIndex: 'transactionHash',
    key: 'transactionHash',
    align: 'center',
    onCell: () => ({ className: 'ant-table-cell_with-link' }),
    render: renderTransactionHash,
    width: '25%',
  },
];

export const transformToRow = ({
  id: key,
  blockNumber,
  blockTimestamp,
  transactionHash,
  type,
}: StakerAction): StakerActionsRow => {
  return {
    key,
    blockNumber,
    blockTimestamp,
    transactionHash,
    type,
  };
};

export const transformToCsvRow = ({
  blockNumber,
  blockTimestamp,
  transactionHash,
  type,
}: StakerActionsRow) => ({
  [titles.blockNumber]: blockNumber,
  [titles.blockTimestamp]: blockTimestamp,
  [titles.transactionHash]: transactionHash,
  [titles.type]: type,
});
