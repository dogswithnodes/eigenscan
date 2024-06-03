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
      rows: Array<BaseActionsRow>;
    }>,
  ) => {
    const { currentPage, perPage, sortParams, rows } = e.data;

    postMessage(
      compose(
        (rows: Array<BaseActionsRow>) => rows.slice(perPage * (currentPage - 1), perPage * currentPage),
        sortTableRows(sortParams),
      )(rows),
    );
  },
);
