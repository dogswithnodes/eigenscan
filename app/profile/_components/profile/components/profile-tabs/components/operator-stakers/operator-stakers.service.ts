import { useQuery } from '@tanstack/react-query';
import { gql } from 'graphql-request';
import { useCallback } from 'react';

import {
  OperatorStaker,
  OperatorStakersRow,
  transformToCsvRow,
  transformToRow,
} from './operator-stakers.model';

import { ProfileTabTableFetchParams } from '../../../../profile.model';

import { SortParams } from '@/app/_models/sort.model';
import { StrategiesMap } from '@/app/_models/strategies.model';
import { fetchAllParallel, request, REQUEST_LIMIT } from '@/app/_services/graphql.service';
import { downloadTableData } from '@/app/_utils/table-data.utils';

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
  strategiesMap: StrategiesMap,
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

      return stakers.map((staker) => transformToRow(staker, strategiesMap));
    },
    placeholderData: (prev) => prev,
  });

const fetchAllStakers = async (
  id: string,
  stakersCount: number,
  strategiesMap: StrategiesMap,
): Promise<Array<OperatorStakersRow>> => {
  const stakers = await fetchAllParallel(stakersCount, async (skip: number) =>
    fetchOperatorStakers(`
      first: ${REQUEST_LIMIT}
      skip: ${skip}
      where: { operator: ${JSON.stringify(id)} }
    `),
  );

  return stakers.map((staker) => transformToRow(staker, strategiesMap));
};

export const useOperatorStakersCsv = (
  id: string,
  stakersCount: number,
  sortParams: SortParams<OperatorStakersRow>,
  strategiesMap: StrategiesMap,
) => {
  const { data, isFetching, refetch } = useQuery({
    queryKey: ['operator-stakers-csv', id, sortParams],
    queryFn: async () => {
      return fetchAllStakers(id, stakersCount, strategiesMap);
    },
    enabled: false,
  });

  const handleCsvDownload = useCallback(async () => {
    downloadTableData({
      data: (data ?? (await refetch()).data) || [],
      fileName: 'operator-stakers',
      sortParams,
      transformToCsvRow,
    });
  }, [data, refetch, sortParams]);

  return {
    isCsvLoading: isFetching,
    handleCsvDownload,
  };
};
