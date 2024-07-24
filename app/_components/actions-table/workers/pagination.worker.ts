'use client';
import { compose } from 'ramda';

import { BaseActionsRow } from '@/app/_models/actions.model';
import { SortParams } from '@/app/_models/sort.model';
import { sortTableRows } from '@/app/_utils/table-data.utils';

addEventListener(
  'message',
  (
    e: MessageEvent<{
      currentPage: number;
      perPage: number;
      sortParams: SortParams<BaseActionsRow>;
      currentActions: Array<string>;
      rows: Array<BaseActionsRow>;
    }>,
  ) => {
    const { currentPage, currentActions, perPage, sortParams, rows } = e.data;

    const filteredRows =
      currentActions.length > 0 ? rows.filter(({ typeId }) => currentActions.includes(typeId)) : rows;

    postMessage({
      rows: compose(
        (rows: Array<BaseActionsRow>) => rows.slice(perPage * (currentPage - 1), perPage * currentPage),
        sortTableRows(sortParams),
      )(filteredRows),
      total: filteredRows.length,
    });
  },
);
