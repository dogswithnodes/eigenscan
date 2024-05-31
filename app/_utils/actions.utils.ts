import { compose, map } from 'ramda';

import { Cache } from './cache';

import { BaseActionsRow } from '../_models/actions.model';
import { SortParams } from '../_models/sort.model';
import { fetchAllConsecutively } from '../_services/graphql.service';

import { sortTableRows } from '@/app/_utils/table-data.utils';

export type NullableFieldsRecord<T extends Record<PropertyKey, unknown> | null> = {
  [Key in keyof T]: T[Key] | null;
};

export type RecordEntries<T> = Array<
  {
    [K in keyof T]: [K, T[K]];
  }[keyof T]
>;

export const fetchAllActions = async <T, U extends BaseActionsRow>({
  cache,
  cacheKey,
  fetcher,
  transformer,
}: {
  cacheKey: string;
  cache: Cache;
  fetcher: (skip: number) => Promise<Array<T>>;
  transformer: (action: T) => U;
}): Promise<Array<U>> => {
  const data = await cache.get(cacheKey);

  if (data) {
    return JSON.parse(data);
  }

  const actions = await fetchAllConsecutively(fetcher);

  const rows = actions.map(transformer);

  await cache.put(cacheKey, JSON.stringify(rows));

  return rows;
};

export const paginateRows = <T extends BaseActionsRow>({
  perPage,
  currentPage,
  sortParams,
}: {
  perPage: number;
  currentPage: number;
  sortParams: SortParams<T>;
}) =>
  compose(
    (rows: Array<T>) => rows.slice(perPage * (currentPage - 1), perPage * currentPage),
    sortTableRows(sortParams),
  );

export const transformToCsv = <T extends BaseActionsRow>({
  sortParams,
  transformer,
}: {
  sortParams: SortParams<T>;
  transformer: (row: T) => Record<string, string>;
}) => compose(map(transformer), sortTableRows(sortParams));
