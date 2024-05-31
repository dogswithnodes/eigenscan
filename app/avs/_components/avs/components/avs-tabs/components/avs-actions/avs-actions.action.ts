'use server';
import { gql } from 'graphql-request';

import { AVSAction, AVSActionsFetchParams, transformToRow } from './avs-actions.model';

import { REQUEST_LIMIT, request } from '@/app/_services/graphql.service';
import { fetchAllActions, paginateRows } from '@/app/_utils/actions.utils';
import { getCache } from '@/app/_utils/cache';

type AVSActionsResponse = {
  avsactions: Array<AVSAction>;
};

const fetchAVSActions = async (requestOptions: string): Promise<Array<AVSAction>> => {
  const { avsactions } = await request<AVSActionsResponse>(gql`
    query {
      avsactions(
        ${requestOptions}
      ) {
        id
        blockNumber
        blockTimestamp
        transactionHash
        type
        minimalStake
        minimumStake
        quorumNumber
        metadataURI
        operator {
          id
        }
        multiplier {
          multiply
        }
        strategy {
          id
          name
        }
      }
    }
  `);

  return avsactions;
};

const cache = getCache(
  process.env.METADATA_CACHE as unknown as CloudflareEnv['METADATA_CACHE'],
  'avs-actions',
);

export const fetchAllAVSActions = async (
  cacheKey: string,
  { id, currentPage, perPage, sortParams }: AVSActionsFetchParams,
) => {
  const rows = await fetchAllActions({
    cache,
    cacheKey,
    fetcher: (skip) =>
      fetchAVSActions(`
        first:${REQUEST_LIMIT}
        skip:${skip}
        where:{avs: ${JSON.stringify(id)}}
      `),
    transformer: transformToRow,
  });

  return {
    rows: paginateRows({ currentPage, perPage, sortParams })(rows),
    total: rows.length,
  };
};

export const fetchAVSActionsCsv = async (cacheKey: string) => {
  const data = await cache.get(cacheKey);

  if (data) {
    return JSON.parse(data);
  }

  return [];
};
