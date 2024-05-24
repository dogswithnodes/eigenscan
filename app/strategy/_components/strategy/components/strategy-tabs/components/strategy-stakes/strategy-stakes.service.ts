import { useCallback } from 'react';
import { gql } from 'graphql-request';
import { useQuery } from '@tanstack/react-query';
import { compose, map } from 'ramda';

import { StrategyStakesRow, StrategyStake, transformToCsvRow, transformToRow } from './strategy-stakes.model';

import { SortParams } from '@/app/_models/sort.model';
import { fetchAllParallel, request, REQUEST_LIMIT } from '@/app/_services/graphql.service';
import { downloadCsv } from '@/app/_utils/csv.utils';
import { sortTableRows } from '@/app/_utils/sort.utils';

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

// TODO generic
type FetchStrategyStakesParams = {
  id: string;
  currentPage: number;
  perPage: number;
  sortParams: SortParams<StrategyStakesRow>;
};

export const useStrategyStakes = (
  { id, currentPage, perPage, sortParams }: FetchStrategyStakesParams,
  balance: string,
  strategyTotalShares: string,
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

      return stakes.map((stake) => transformToRow({ ...stake, balance, strategyTotalShares }));
    },
    placeholderData: (prev) => prev,
  });

const fetchAllStrategyStakers = async (
  id: string,
  stakesCount: number,
  balance: string,
  strategyTotalShares: string,
): Promise<Array<StrategyStakesRow>> => {
  const stakes = await fetchAllParallel(stakesCount, async (skip: number) =>
    fetchStrategyStakes(`
      first: ${REQUEST_LIMIT}
      skip: ${skip}
      where: { strategy: ${JSON.stringify(id)} }
    `),
  );

  return stakes.map((stake) => transformToRow({ ...stake, balance, strategyTotalShares }));
};
// TODO generic name
const downloadStrategyStakesCsv = (
  data: Array<StrategyStakesRow>,
  sortParams: SortParams<StrategyStakesRow>,
) => downloadCsv(compose(map(transformToCsvRow), sortTableRows(sortParams))(data), 'strategy-stakes');

export const useStrategyStakesCsv = (
  id: string,
  stakesCount: number,
  sortParams: SortParams<StrategyStakesRow>,
  balance: string,
  strategyTotalShares: string,
) => {
  const { data, isFetching, refetch } = useQuery({
    queryKey: ['strategy-stakes-csv', id, sortParams],
    queryFn: async () => {
      return fetchAllStrategyStakers(id, stakesCount, balance, strategyTotalShares);
    },
    enabled: false,
  });

  const handleCsvDownload = useCallback(() => {
    data
      ? downloadStrategyStakesCsv(data, sortParams)
      : refetch().then((res) => (res.data ? downloadStrategyStakesCsv(res.data, sortParams) : res));
  }, [data, refetch, sortParams]);

  return {
    isCsvLoading: isFetching,
    handleCsvDownload,
  };
};
