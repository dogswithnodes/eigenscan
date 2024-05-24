import { useCallback } from 'react';
import { gql } from 'graphql-request';
import { useQuery } from '@tanstack/react-query';
import { compose, map } from 'ramda';

import {
  OperatorStaker,
  OperatorStakersRow,
  transformToCsvRow,
  transformToRow,
} from './operator-stakers.model';

import { ProfileTabTableFetchParams } from '../../../../profile.model';

import { SortParams } from '@/app/_models/sort.model';
import { StrategyToEthBalance } from '@/app/_models/strategies.model';
import { fetchAllParallel, request, REQUEST_LIMIT } from '@/app/_services/graphql.service';
import { downloadCsv } from '@/app/_utils/csv.utils';
import { sortTableRows } from '@/app/_utils/sort.utils';

type StakersResponse = {
  delegators: Array<OperatorStaker>;
};

const fetchOperatorStakers = async (requestOptions: string) => {
  const { delegators } = await request<StakersResponse>(
    gql`
      query {
        delegators(
          ${requestOptions}
        ) {
          id
          staker {
            id
            totalEigenShares
          }
          delegations(
            first: ${REQUEST_LIMIT},
          ) {
            shares
            strategy {
              id
              totalShares
            }
          }
          delegatedAt
          undelegatedAt
        }
      }
    `,
  );

  return delegators;
};

type FetchOperatorStakersParams = ProfileTabTableFetchParams<OperatorStakersRow>;

export const useOperatorStakers = (
  { id, currentPage, perPage, sortParams }: FetchOperatorStakersParams,
  strategyToEthBalance: StrategyToEthBalance,
) =>
  useQuery({
    // TODO const key
    queryKey: ['operator-stakers', currentPage, perPage, sortParams],
    queryFn: async () => {
      const stakers = await fetchOperatorStakers(`
        first: ${perPage}
        skip: ${perPage * (currentPage - 1)}
        orderBy: ${sortParams.orderBy}
        orderDirection: ${sortParams.orderDirection}
        where: { operator: ${JSON.stringify(id)} }
      `);

      return stakers.map((staker) => transformToRow(staker, strategyToEthBalance));
    },
    placeholderData: (prev) => prev,
  });

const fetchAllStakers = async (
  id: string,
  stakersCount: number,
  strategyToEthBalance: StrategyToEthBalance,
): Promise<Array<OperatorStakersRow>> => {
  const stakers = await fetchAllParallel(stakersCount, async (skip: number) =>
    fetchOperatorStakers(`
      first: ${REQUEST_LIMIT}
      skip: ${skip}
      where: { operator: ${JSON.stringify(id)} }
    `),
  );

  return stakers.map((staker) => transformToRow(staker, strategyToEthBalance));
};
// TODO generic name
const downloadOperatorStakersCsv = (
  data: Array<OperatorStakersRow>,
  sortParams: SortParams<OperatorStakersRow>,
) => downloadCsv(compose(map(transformToCsvRow), sortTableRows(sortParams))(data), 'operator-stakers');

export const useOperatorStakersCsv = (
  id: string,
  stakersCount: number,
  sortParams: SortParams<OperatorStakersRow>,
  strategyToEthBalance: StrategyToEthBalance,
) => {
  const { data, isFetching, refetch } = useQuery({
    queryKey: ['operator-stakers-csv', id, sortParams],
    queryFn: async () => {
      return fetchAllStakers(id, stakersCount, strategyToEthBalance);
    },
    enabled: false,
  });

  const handleCsvDownload = useCallback(() => {
    data
      ? downloadOperatorStakersCsv(data, sortParams)
      : refetch().then((res) => (res.data ? downloadOperatorStakersCsv(res.data, sortParams) : res));
  }, [data, refetch, sortParams]);

  return {
    isCsvLoading: isFetching,
    handleCsvDownload,
  };
};
