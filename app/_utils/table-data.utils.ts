import BigNumber from 'bignumber.js';
import { compose, map, sort } from 'ramda';

import { downloadCsv } from './csv.utils';

import { SortParams } from '../_models/sort.model';

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

    if (x instanceof BigNumber && y instanceof BigNumber) {
      return isAscending ? Number(x) - Number(y) : Number(y) - Number(x);
    }

    return new Intl.Collator('en', { sensitivity: 'base', ignorePunctuation: true }).compare(
      String(isAscending ? x : y),
      String(isAscending ? y : x),
    );
  };

export const sortTableRows = <T extends Record<string, unknown>>(sortParams: SortParams<T>) =>
  sort(rowsComparator(sortParams));

export const downloadTableData = <Row extends Record<string, unknown>>({
  fileName,
  sortParams,
  data,
  transformToCsvRow,
}: {
  sortParams: SortParams<Row>;
  data: Array<Row>;
  fileName: string;
  transformToCsvRow: (row: Row) => Record<string, unknown>;
}) => downloadCsv(compose(map(transformToCsvRow), sortTableRows(sortParams))(data), fileName);
