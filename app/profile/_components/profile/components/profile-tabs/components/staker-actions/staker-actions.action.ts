'use server';
import { gql } from 'graphql-request';

import { StakerAction, StakerActionsFetchParams, transformToRow } from './staker-actions.model';

import { REQUEST_LIMIT, request } from '@/app/_services/graphql.service';
import { fetchAllActions, paginateRows } from '@/app/_utils/actions.utils';
import { getCache } from '@/app/_utils/cache';

type StakerActionsResponse = {
  stakerActions: Array<StakerAction>;
};

const fetchStakerActions = async (requestOptions: string): Promise<Array<StakerAction>> => {
  const { stakerActions } = await request<StakerActionsResponse>(gql`
    query {
      stakerActions(
        ${requestOptions}
      ) {
        id
        blockNumber
        blockTimestamp
        transactionHash
        type
        delegatedTo {
          id
        }
        eigonPod
        nonce
        share
        strategy {
          id
          name
        }
        startBlock
        token
        withdrawer
        withdrawal {
          queuedBlockNumber
          queuedTransactionHash
          completedBlockNumber
          completedTransactionHash
          strategies(
            first: ${REQUEST_LIMIT}
            where: {share_gt: "0", strategy_not: null}
          ) {
            share
            strategy {
              tokenSymbol
            }
          }
        }
      }
    }
  `);

  return stakerActions;
};

const cache = getCache(
  process.env.METADATA_CACHE as unknown as CloudflareEnv['METADATA_CACHE'],
  'staker-actions',
);

export const fetchAllStakerActions = async (
  cacheKey: string,
  { id, currentPage, perPage, sortParams }: StakerActionsFetchParams,
) => {
  const rows = await fetchAllActions({
    cache,
    cacheKey,
    fetcher: (skip) =>
      fetchStakerActions(`
        first: ${REQUEST_LIMIT}
        skip:${skip}
        where: {staker: ${JSON.stringify(id)}}
      `),
    transformer: transformToRow,
  });

  return {
    rows: paginateRows({ currentPage, perPage, sortParams })(rows),
    total: rows.length,
  };
};

export const fetchStakerActionsCsv = async (cacheKey: string) => {
  const data = await cache.get(cacheKey);

  if (data) {
    return JSON.parse(data);
  }

  return [];
};
