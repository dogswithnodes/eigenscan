import { useQuery } from '@tanstack/react-query';
import { gql } from 'graphql-request';
import { useCallback } from 'react';

import {
  OperatorAction,
  OperatorActionsRow,
  transformToRow,
  transformToCsvRow,
} from './operator-actions.model';

import { ProfileTabTableFetchParams } from '../../../../profile.model';

import { REQUEST_LIMIT, fetchAllParallel, request } from '@/app/_services/graphql.service';
import { downloadTableData } from '@/app/_utils/table-data.utils';

type OperatorActionsResponse = {
  operatorActions: Array<OperatorAction>;
};

const fetchOperatorActions = async (requestOptions: string): Promise<Array<OperatorAction>> => {
  const { operatorActions } = await request<OperatorActionsResponse>(gql`
    query {
      operatorActions(
        ${requestOptions}
      ) {
        id
        blockNumber
        blockTimestamp
        transactionHash
        type
        avs {
          id
        }
        delegationApprover
        earningsReceiver
        delegator {
          id
        }
        metadataURI
        stakerOptOutWindowBlocks
        status
        quorum {
          quorum {
            quorum
          }
        }
      }
    }
  `);

  return operatorActions;
};

type UseOperatorActionsParams = ProfileTabTableFetchParams<OperatorActionsRow>;

export const useOperatorActions = ({ id, currentPage, perPage, sortParams }: UseOperatorActionsParams) => {
  return useQuery({
    queryKey: ['operator-actions', id, currentPage, perPage, sortParams],
    queryFn: async () => {
      const actions = await fetchOperatorActions(`
        first: ${perPage}
        skip: ${perPage * (currentPage - 1)}
        orderBy: ${sortParams.orderBy}
        orderDirection: ${sortParams.orderDirection}
        where: {operator: ${JSON.stringify(id)}}
      `);

      return actions.map(transformToRow);
    },
    placeholderData: (prev) => prev,
  });
};

type UseOperatorActionsCsvParams = {
  actionsCount: number;
} & Pick<UseOperatorActionsParams, 'sortParams' | 'id'>;

export const useOperatorActionsCsv = ({ id, actionsCount, sortParams }: UseOperatorActionsCsvParams) => {
  const { data, isFetching, refetch } = useQuery({
    queryKey: ['operator-actions-csv', id, sortParams],
    queryFn: async () => {
      const actions = await fetchAllParallel(actionsCount, async (skip) =>
        fetchOperatorActions(`
          first: ${REQUEST_LIMIT}
          skip: ${skip}
          where: {operator: ${JSON.stringify(id)}}
        `),
      );

      return actions.map(transformToRow);
    },
    enabled: false,
  });

  const handleCsvDownload = useCallback(async () => {
    downloadTableData({
      data: (data ?? (await refetch()).data) || [],
      fileName: 'operator-actions',
      sortParams,
      transformToCsvRow,
    });
  }, [data, refetch, sortParams]);

  return {
    isCsvLoading: isFetching,
    handleCsvDownload,
  };
};
