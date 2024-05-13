import { sort } from 'ramda';

import { SortParams } from '../_models/sort.model';

export const rowsComparator =
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

export const sortTableRows = <T extends Record<string, unknown>>(sortParams: SortParams<T>) =>
  sort(rowsComparator(sortParams));
