'use client';
import { ColumnType } from 'antd/es/table';

import { BaseActionsRow } from '@/app/_models/actions.model';
import { renderDate, renderTransactionHash } from '@/app/_utils/render.utils';

export const titles: Record<Exclude<keyof BaseActionsRow, 'key'>, string> = {
  blockNumber: 'Block Number',
  blockTimestamp: 'Date time',
  type: 'Type',
  transactionHash: 'Transaction hash',
};

export const columnsWidth = {
  '2560': [489, 489, 489, 489],
  '1920': [348, 348, 348, 348],
  '1440': [308, 308, 308, 308],
  '1280': [285, 285, 284, 284],
};

export const getColumns = <T extends BaseActionsRow>(): Array<ColumnType<T>> => [
  {
    title: titles.blockTimestamp,
    dataIndex: 'blockTimestamp',
    key: 'blockTimestamp',
    align: 'center',
    render: renderDate,
  },
  {
    title: titles.blockNumber,
    dataIndex: 'blockNumber',
    key: 'blockNumber',
    align: 'center',
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
    align: 'center',
    onCell: () => ({ className: 'ant-table-cell_with-link' }),
    render: renderTransactionHash,
  },
];
