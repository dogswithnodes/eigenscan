import { useQuery } from '@tanstack/react-query';
import { gql } from 'graphql-request';
import { useCallback } from 'react';

import { AVSAction, AVSActionsRow, transformToRow, transformToCsvRow } from './avs-actions.model';

import { FetchParams } from '@/app/_models/table.model';
import { REQUEST_LIMIT, fetchAllParallel, request } from '@/app/_services/graphql.service';
import { downloadTableData } from '@/app/_utils/table-data.utils';

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

type AVSActionsFetchParams = {
  avsId: string;
};

type UseAVSActionsParams = AVSActionsFetchParams & FetchParams<AVSActionsRow>;

export const useAVSActions = ({ avsId, currentPage, perPage, sortParams }: UseAVSActionsParams) => {
  return useQuery({
    queryKey: ['avs-actions', avsId, currentPage, perPage, sortParams],
    queryFn: async () => {
      const actions = await fetchAVSActions(`
        first: ${perPage}
        skip: ${perPage * (currentPage - 1)}
        orderBy: ${sortParams.orderBy}
        orderDirection: ${sortParams.orderDirection}
        where: {avs: ${JSON.stringify(avsId)}}
      `);

      return actions.map(transformToRow);
    },
    placeholderData: (prev) => prev,
  });
};

type UseAVSActionsCsvParams = AVSActionsFetchParams & {
  actionsCount: number;
} & Pick<FetchParams<AVSActionsRow>, 'sortParams'>;

export const useAVSActionsCsv = ({ avsId, actionsCount, sortParams }: UseAVSActionsCsvParams) => {
  const { data, isFetching, refetch } = useQuery({
    queryKey: ['avs-actions-csv', avsId, sortParams],
    queryFn: async () => {
      const actions = await fetchAllParallel(actionsCount, async (skip) =>
        fetchAVSActions(`
          first: ${REQUEST_LIMIT}
          skip: ${skip}
          where: {avs: ${JSON.stringify(avsId)}}
        `),
      );

      return actions.map(transformToRow);
    },
    enabled: false,
  });

  const handleCsvDownload = useCallback(async () => {
    downloadTableData({
      data: (data ?? (await refetch()).data) || [],
      fileName: 'strategy-stakes',
      sortParams,
      transformToCsvRow,
    });
  }, [data, refetch, sortParams]);

  return {
    isCsvLoading: isFetching,
    handleCsvDownload,
  };
};
