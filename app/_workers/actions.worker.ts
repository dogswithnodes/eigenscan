import { compose } from 'ramda';

import { BaseActionsRow } from '../_models/actions.model';
import { SortParams } from '../_models/sort.model';
import { sortTableRows } from '../_utils/table-data.utils';

addEventListener(
  'message',
  <T extends BaseActionsRow>(
    event: MessageEvent<{
      data: Array<T>;
      perPage: number;
      currentPage: number;
      sortParams: SortParams<T>;
    }>,
  ) => {
    const { data, perPage, currentPage, sortParams } = event.data;

    postMessage(
      compose(
        (rows: Array<T>) => rows.slice(perPage * (currentPage - 1), perPage * currentPage),
        sortTableRows(sortParams),
      )(data),
    );
  },
);
