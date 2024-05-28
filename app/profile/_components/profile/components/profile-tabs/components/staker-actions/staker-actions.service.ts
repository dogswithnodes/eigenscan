import { useQuery } from '@tanstack/react-query';
import { gql } from 'graphql-request';
import { useCallback } from 'react';

import { StakerAction, StakerActionsRow, transformToRow, transformToCsvRow } from './staker-actions.model';

import { ProfileTabTableFetchParams } from '../../../../profile.model';

import { REQUEST_LIMIT, fetchAllParallel, request } from '@/app/_services/graphql.service';
import { downloadTableData } from '@/app/_utils/table-data.utils';

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

type UseStakerActionsParams = ProfileTabTableFetchParams<StakerActionsRow>;

export const useStakerActions = ({ id, currentPage, perPage, sortParams }: UseStakerActionsParams) => {
  return useQuery({
    queryKey: ['staker-actions', id, currentPage, perPage, sortParams],
    queryFn: async () => {
      const actions = await fetchStakerActions(`
        first: ${perPage}
        skip: ${perPage * (currentPage - 1)}
        orderBy: ${sortParams.orderBy}
        orderDirection: ${sortParams.orderDirection}
        where: {staker: ${JSON.stringify(id)}}
      `);

      return actions.map(transformToRow);
    },
    placeholderData: (prev) => prev,
  });
};

type UseStakerActionsCsvParams = {
  actionsCount: number;
} & Pick<UseStakerActionsParams, 'sortParams' | 'id'>;

export const useStakerActionsCsv = ({ id, actionsCount, sortParams }: UseStakerActionsCsvParams) => {
  const { data, isFetching, refetch } = useQuery({
    queryKey: ['staker-actions-csv', id, sortParams],
    queryFn: async () => {
      const actions = await fetchAllParallel(actionsCount, async (skip) =>
        fetchStakerActions(`
          first: ${REQUEST_LIMIT}
          skip: ${skip}
          where: {staker: ${JSON.stringify(id)}}
        `),
      );

      return actions.map(transformToRow);
    },
    enabled: false,
  });

  const handleCsvDownload = useCallback(async () => {
    downloadTableData({
      data: (data ?? (await refetch()).data) || [],
      fileName: 'staker-actions',
      sortParams,
      transformToCsvRow,
    });
  }, [data, refetch, sortParams]);

  return {
    isCsvLoading: isFetching,
    handleCsvDownload,
  };
};
