import { BaseActionsRow } from '../../../_models/actions.model';
import { SortParams } from '../../../_models/sort.model';

const rowsComparator =
  <T extends Record<string, unknown>>(sortParams: SortParams<T>) =>
  (a: T, b: T) => {
    const { orderBy, orderDirection } = sortParams;
    const isAscending = orderDirection === 'asc';
    const x = a[orderBy];
    const y = b[orderBy];

    if (x === null) {
      return 1;
    }

    if (y === null) {
      return -1;
    }

    if (typeof x === 'number' && typeof y === 'number') {
      return isAscending ? x - y : y - x;
    }

    return new Intl.Collator('en', { sensitivity: 'base', ignorePunctuation: true }).compare(
      String(isAscending ? x : y),
      String(isAscending ? y : x),
    );
  };

const sortTableRows =
  <T extends Record<string, unknown>>(sortParams: SortParams<T>) =>
  (arr: Array<T>) =>
    arr.sort(rowsComparator(sortParams));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const compose = (...fs: Array<(...args: any) => any>) =>
  fs.reduceRight(
    (f1, f2) =>
      (...args) =>
        f2(f1(...args)),
  );

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
