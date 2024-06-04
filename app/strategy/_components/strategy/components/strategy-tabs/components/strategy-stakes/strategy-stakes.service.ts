import { useQuery } from '@tanstack/react-query';
import { gql } from 'graphql-request';
import { useCallback } from 'react';

import { StrategyStakesRow, StrategyStake, transformToCsvRow, transformToRow } from './strategy-stakes.model';

import { SortParams } from '@/app/_models/sort.model';
import { SingleEntityFetchParams } from '@/app/_models/table.model';
import { fetchAllParallel, request, REQUEST_LIMIT } from '@/app/_services/graphql.service';
import { downloadTableData } from '@/app/_utils/table-data.utils';

type StrategyStakesResponse = {
  strategyDeposits: Array<StrategyStake>;
};

const fetchStrategyStakes = async (requestOptions: string) => {
  const { strategyDeposits } = await request<StrategyStakesResponse>(
    gql`
      query {
        strategyDeposits(
          ${requestOptions}
        ) {
          id
          lastUpdatedTimestamp
          lastUpdatedTransactionHash
          shares
          createdTimestamp
          createdTransactionHash
          depositor {
            id
          }
        }
      }
    `,
  );

  return strategyDeposits;
};

export const useStrategyStakes = (
  { id, currentPage, perPage, sortParams }: SingleEntityFetchParams<StrategyStakesRow>,
  balance: string,
  totalSharesAndWithdrawing: string,
) =>
  useQuery({
    queryKey: ['strategy-stakes', currentPage, perPage, sortParams],
    queryFn: async () => {
      const stakes = await fetchStrategyStakes(`
        first: ${perPage}
        skip: ${perPage * (currentPage - 1)}
        orderBy: ${sortParams.orderBy}
        orderDirection: ${sortParams.orderDirection}
        where: { strategy: ${JSON.stringify(id)} }
      `);

      return stakes.map((stake) => transformToRow({ ...stake, balance, totalSharesAndWithdrawing }));
    },
    placeholderData: (prev) => prev,
  });

const fetchAllStrategyStakers = async (
  id: string,
  stakesCount: number,
  balance: string,
  totalSharesAndWithdrawing: string,
): Promise<Array<StrategyStakesRow>> => {
  const stakes = await fetchAllParallel(stakesCount, async (skip) =>
    fetchStrategyStakes(`
      first: ${REQUEST_LIMIT}
      skip: ${skip}
      where: { strategy: ${JSON.stringify(id)} }
    `),
  );

  return stakes.map((stake) => transformToRow({ ...stake, balance, totalSharesAndWithdrawing }));
};

export const useStrategyStakesCsv = (
  id: string,
  stakesCount: number,
  sortParams: SortParams<StrategyStakesRow>,
  balance: string,
  totalSharesAndWithdrawing: string,
) => {
  const { data, isFetching, refetch } = useQuery({
    queryKey: ['strategy-stakes-csv', id, sortParams],
    queryFn: async () => {
      return fetchAllStrategyStakers(id, stakesCount, balance, totalSharesAndWithdrawing);
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
