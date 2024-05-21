import { SortParams } from './sort.model';

export type FetchParams<Row> = {
  currentPage: number;
  perPage: number;
  sortParams: SortParams<Row>;
};
