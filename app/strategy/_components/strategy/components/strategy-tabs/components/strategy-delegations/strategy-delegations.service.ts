import { useQuery } from '@tanstack/react-query';
import { gql } from 'graphql-request';
import { useCallback } from 'react';

import {
  StrategyDelegationsRow,
  StrategyDelegation,
  transformToCsvRow,
  transformToRow,
} from './strategy-delegations.model';

import { SortParams } from '@/app/_models/sort.model';
import { fetchAllParallel, request, REQUEST_LIMIT } from '@/app/_services/graphql.service';
import { downloadTableData } from '@/app/_utils/table-data.utils';

type StrategyDelegationsResponse = {
  delegations: Array<StrategyDelegation>;
};

const fetchStrategyDelegations = async (requestOptions: string) => {
  const { delegations } = await request<StrategyDelegationsResponse>(
    gql`
      query {
        delegations(
          ${requestOptions}
        ) {
          id
          shares
          createdTimestamp
          lastUpdatedTimestamp
          lastUpdatedTransactionHash
          createdTransactionHash
          operatorStrategy {
            operator {
              id
            }
          }
        }
      }
    `,
  );

  return delegations;
};

// TODO generic
type FetchStrategyDelegationsParams = {
  id: string;
  currentPage: number;
  perPage: number;
  sortParams: SortParams<StrategyDelegationsRow>;
};

export const useStrategyDelegations = (
  { id, currentPage, perPage, sortParams }: FetchStrategyDelegationsParams,
  balance: string,
  totalSharesAndWithdrawing: string,
) =>
  useQuery({
    queryKey: ['strategy-delegations', currentPage, perPage, sortParams],
    queryFn: async () => {
      const delegations = await fetchStrategyDelegations(`
        first: ${perPage}
        skip: ${perPage * (currentPage - 1)}
        orderBy: ${sortParams.orderBy}
        orderDirection: ${sortParams.orderDirection}
        where: { strategy: ${JSON.stringify(id)} }
      `);

      return delegations.map((stake) => transformToRow({ ...stake, balance, totalSharesAndWithdrawing }));
    },
    placeholderData: (prev) => prev,
  });

const fetchAllStrategyDelegations = async (
  id: string,
  delegationsCount: number,
  balance: string,
  totalSharesAndWithdrawing: string,
): Promise<Array<StrategyDelegationsRow>> => {
  const delegations = await fetchAllParallel(delegationsCount, async (skip: number) =>
    fetchStrategyDelegations(`
      first: ${REQUEST_LIMIT}
      skip: ${skip}
      where: { strategy: ${JSON.stringify(id)} }
    `),
  );

  return delegations.map((stake) => transformToRow({ ...stake, balance, totalSharesAndWithdrawing }));
};

export const useStrategyDelegationsCsv = (
  id: string,
  delegationsCount: number,
  sortParams: SortParams<StrategyDelegationsRow>,
  balance: string,
  totalSharesAndWithdrawing: string,
) => {
  const { data, isFetching, refetch } = useQuery({
    queryKey: ['strategy-delegations-csv', id, sortParams],
    queryFn: async () => {
      return fetchAllStrategyDelegations(id, delegationsCount, balance, totalSharesAndWithdrawing);
    },
    enabled: false,
  });

  const handleCsvDownload = useCallback(async () => {
    downloadTableData({
      data: (data ?? (await refetch()).data) || [],
      fileName: 'strategy-delegations',
      sortParams,
      transformToCsvRow,
    });
  }, [data, refetch, sortParams]);

  return {
    isCsvLoading: isFetching,
    handleCsvDownload,
  };
};
