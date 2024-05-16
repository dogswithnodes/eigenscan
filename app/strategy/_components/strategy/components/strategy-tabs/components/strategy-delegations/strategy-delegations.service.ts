import { useCallback } from 'react';
import { gql } from 'graphql-request';
import { useQuery } from '@tanstack/react-query';
import { compose, map } from 'ramda';

import {
  StrategyDelegationsRow,
  StrategyDelegation,
  transformToCsvRow,
  transformToRow,
} from './strategy-delegations.model';

import { SortParams } from '@/app/_models/sort.model';
import { fetchAllParallel, request, REQUEST_LIMIT } from '@/app/_services/graphql.service';
import { downloadCsv } from '@/app/_utils/csv.utils';
import { sortTableRows } from '@/app/_utils/sort.utils';

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
  strategyTotalShares: string,
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

      return delegations.map((stake) => transformToRow({ ...stake, balance, strategyTotalShares }));
    },
    placeholderData: (prev) => prev,
  });

const fetchAllStrategyDelegationsParallel = async (
  id: string,
  delegationsCount: number,
  balance: string,
  strategyTotalShares: string,
): Promise<Array<StrategyDelegationsRow>> => {
  const delegations = await fetchAllParallel(delegationsCount, async (skip: number) =>
    fetchStrategyDelegations(`
      first: ${REQUEST_LIMIT}
      skip: ${skip}
      where: { strategy: ${JSON.stringify(id)} }
    `),
  );

  return delegations.map((stake) => transformToRow({ ...stake, balance, strategyTotalShares }));
};
// TODO generic name
const downloadStrategyDelegationsCsv = (
  data: Array<StrategyDelegationsRow>,
  sortParams: SortParams<StrategyDelegationsRow>,
) => downloadCsv(compose(map(transformToCsvRow), sortTableRows(sortParams))(data), 'strategy-delegations');

export const useStrategyDelegationsCsv = (
  id: string,
  delegationsCount: number,
  sortParams: SortParams<StrategyDelegationsRow>,
  balance: string,
  strategyTotalShares: string,
) => {
  const { data, isFetching, refetch } = useQuery({
    queryKey: ['strategy-delegations-csv', id, sortParams],
    queryFn: async () => {
      return fetchAllStrategyDelegationsParallel(id, delegationsCount, balance, strategyTotalShares);
    },
    enabled: false,
  });

  const handleCsvDownload = useCallback(() => {
    data
      ? downloadStrategyDelegationsCsv(data, sortParams)
      : refetch().then((res) => (res.data ? downloadStrategyDelegationsCsv(res.data, sortParams) : res));
  }, [data, refetch, sortParams]);

  return {
    isCsvLoading: isFetching,
    handleCsvDownload,
  };
};
