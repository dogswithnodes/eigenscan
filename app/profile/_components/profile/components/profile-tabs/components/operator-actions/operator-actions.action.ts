'use server';
import { compose } from 'ramda';

import { OperatorActionsFetchParams, OperatorActionsRow, transformToRow } from './operator-actions.model';
import { fetchOperatorActions } from './operator-actions.service';

import { REQUEST_LIMIT } from '@/app/_services/graphql.service';
import { fetchAllActions } from '@/app/_utils/actions.utils';
import { getCache } from '@/app/_utils/cache';
import { sortTableRows } from '@/app/_utils/table-data.utils';

const cache = getCache(process.env.METADATA_CACHE as unknown as CloudflareEnv['METADATA_CACHE'], 'metadata');

export const fetchAllOperatorActions = async (
  cacheKey: string,
  { id, currentPage, perPage, sortParams }: OperatorActionsFetchParams,
) => {
  const rows = await fetchAllActions({
    cache,
    cacheKey,
    fetcher: (skip) =>
      fetchOperatorActions(`
        first: ${REQUEST_LIMIT}
        skip:${skip}
        where: {operator: ${JSON.stringify(id)}}
      `),
    transformer: transformToRow,
  });

  return {
    rows: compose(
      (rows: Array<OperatorActionsRow>) => rows.slice(perPage * (currentPage - 1), perPage * currentPage),
      sortTableRows(sortParams),
    )(rows),
    total: rows.length,
  };
};
