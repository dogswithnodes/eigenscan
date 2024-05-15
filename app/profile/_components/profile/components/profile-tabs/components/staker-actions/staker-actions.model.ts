'use client';
import { ColumnType } from 'antd/es/table';

import { StakerAction } from '../../../../profile.model';

import { BaseActionsRow } from '@/app/_models/actions.model';
import { renderDate, renderTransactionHash } from '@/app/_utils/render.utils';

export type StakerActionsRow = BaseActionsRow;

const titles: Record<Exclude<keyof BaseActionsRow, 'key'>, string> = {
  blockNumber: 'Block Number',
  blockTimestamp: 'Block timestamp',
  type: 'Type',
  transactionHash: 'Transaction hash',
};

export const columnsWidth = {
  '2560': [292, 292, 292, 292],
  '1920': [188, 188, 188, 188],
  '1440': [164, 164, 164, 164],
  '1280': [157, 157, 157, 157],
};

export const columns: Array<ColumnType<BaseActionsRow>> = [
  {
    title: titles.blockNumber,
    dataIndex: 'blockNumber',
    key: 'blockNumber',
    align: 'center',
  },
  {
    title: titles.blockTimestamp,
    dataIndex: 'blockTimestamp',
    key: 'blockTimestamp',
    align: 'center',
    render: renderDate,
  },
  {
    title: titles.type,
    dataIndex: 'type',
    key: 'type',
    align: 'center',
  },
  {
    title: titles.transactionHash,
    dataIndex: 'transactionHash',
    key: 'transactionHash',
    onCell: () => ({ className: 'ant-table-cell_with-link' }),
    render: renderTransactionHash,
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
