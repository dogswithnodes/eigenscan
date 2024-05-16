import { useCallback } from 'react';
import { gql } from 'graphql-request';
import { useQuery } from '@tanstack/react-query';
import { compose, map } from 'ramda';

import {
  OperatorStakerServer,
  OperatorStakersRow,
  transformToCsvRow,
  transformToRow,
} from './operator-stakers.model';

import { SortParams } from '@/app/_models/sort.model';
import { fetchAllParallel, request, REQUEST_LIMIT } from '@/app/_services/graphql.service';
import { downloadCsv } from '@/app/_utils/csv.utils';
import { sortTableRows } from '@/app/_utils/sort.utils';
import { StrategyToTvlMap } from '@/app/_utils/strategies.utils';

type StakersResponse = {
  delegators: Array<OperatorStakerServer>;
};
// TODO remove fragments
const operatorStakerFragment = gql`
  fragment OperatorStakerFragment on Delegator {
    id
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
`;

const fetchOperatorStakers = async (requestOptions: string) => {
  const { delegators } = await request<StakersResponse>(
    gql`
      ${operatorStakerFragment}
      query {
        delegators(
          ${requestOptions}
        ) {
          ...OperatorStakerFragment
        }
      }
    `,
  );

  return delegators;
};

// TODO generic
type FetchOperatorStakersParams = {
  id: string;
  currentPage: number;
  perPage: number;
  sortParams: SortParams<OperatorStakersRow>;
};

export const useOperatorStakers = (
  { id, currentPage, perPage, sortParams }: FetchOperatorStakersParams,
  strategyToTvl: StrategyToTvlMap,
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

      return stakers.map((staker) => transformToRow(staker, strategyToTvl));
    },
    placeholderData: (prev) => prev,
  });

const fetchAllStakersParallel = async (
  id: string,
  stakersCount: number,
  strategyToTvl: StrategyToTvlMap,
): Promise<Array<OperatorStakersRow>> => {
  const stakers = await fetchAllParallel(stakersCount, async (skip: number) =>
    fetchOperatorStakers(`
      first: ${REQUEST_LIMIT}
      skip: ${skip}
      where: { operator: ${JSON.stringify(id)} }
    `),
  );

  return stakers.map((staker) => transformToRow(staker, strategyToTvl));
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
  strategyToTvl: StrategyToTvlMap,
) => {
  const { data, isFetching, refetch } = useQuery({
    queryKey: ['operator-stakers-csv', id, sortParams],
    queryFn: async () => {
      return fetchAllStakersParallel(id, stakersCount, strategyToTvl);
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
