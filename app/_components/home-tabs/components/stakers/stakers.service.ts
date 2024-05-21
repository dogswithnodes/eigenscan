import { useCallback } from 'react';
import { gql } from 'graphql-request';
import { useQuery } from '@tanstack/react-query';
import { compose, map } from 'ramda';

import { Staker, StakersRow, transformToCsvRow, transformToRow } from './stakers.model';

import { HomeTabTableFetchParams } from '../../home-tabs.model';

import { SortParams } from '@/app/_models/sort.model';
import { fetchAllParallel, request, REQUEST_LIMIT } from '@/app/_services/graphql.service';
import { useProtocolData } from '@/app/_services/protocol-data.service';
import { downloadCsv } from '@/app/_utils/csv.utils';
import { sortTableRows } from '@/app/_utils/sort.utils';
import { isTermLongEnough } from '@/app/_utils/account-search.utils';
import { useStrategies } from '@/app/_services/strategies.service';

type StakersResponse = {
  stakers: Array<Staker>;
};

const fetchStakers = async (requestOptions: string) => {
  const { stakers } = await request<StakersResponse>(
    gql`
      query {
        stakers(
          ${requestOptions}
        ) {
          id
          totalEigenWithdrawalsShares
          totalEigenShares
          delegator {
            operator {
              id
            }
          }
          stakes (
            first: ${REQUEST_LIMIT},
            orderBy: lastUpdatedTimestamp,
            orderDirection: desc
          ) {
            id
            lastUpdatedTimestamp
            shares
            strategy {
              id
              totalShares
            }
          }
          withdrawals(
            first: ${REQUEST_LIMIT},
            orderBy: queuedBlockTimestamp, 
            orderDirection: desc
          ) {
            id
            queuedBlockTimestamp
            strategies(
              first:${REQUEST_LIMIT}
              where: {strategy_not: null, share_not: null}
            ) {
              share
              strategy {
                id
                totalShares
              }
            }
          }
        }
      }
    `,
  );

  return stakers;
};

type FetchStakersParams = HomeTabTableFetchParams<StakersRow>;

export const useStakers = ({ currentPage, perPage, sortParams, idFilters }: FetchStakersParams) => {
  const { data } = useStrategies();

  return useQuery({
    enabled: Boolean(data),
    queryKey: ['stakers', currentPage, perPage, sortParams, idFilters],
    queryFn: async () => {
      if (!data) {
        return Promise.reject(new Error('Stakers request cannot be sent without strategies data.'));
      }

      const stakers = await fetchStakers(`
        first: ${perPage}
        skip: ${perPage * (currentPage - 1)}
        orderBy: ${sortParams.orderBy}
        orderDirection: ${sortParams.orderDirection}
        where: ${idFilters ? `{ id_in: ${JSON.stringify(idFilters)} }` : null}
      `);

      return stakers.map((staker) => transformToRow(staker, data.strategyToEthBalance));
    },
    placeholderData: (prev) => prev,
  });
};

type StakersSearchResponse = {
  accountSearch: Array<{
    staker: {
      id: string;
    } | null;
  }>;
};

export const useStakersSearch = (searchTerm: string) => {
  return useQuery({
    queryKey: ['stakers-search', searchTerm],
    queryFn: async () => {
      const { accountSearch } = await request<StakersSearchResponse>(
        gql`
          query {
            accountSearch(
              text: "${searchTerm}:* | 0x${searchTerm}:*",
              first: ${REQUEST_LIMIT}
            ) {
              staker {
                id
              }
            }
          }
        `,
      );

      return accountSearch.flatMap((staker) => staker.staker?.id || []);
    },
    enabled: isTermLongEnough(searchTerm),
  });
};

const downloadStakersCsv = (data: Array<StakersRow>, sortParams: SortParams<StakersRow>) =>
  downloadCsv(compose(map(transformToCsvRow), sortTableRows(sortParams))(data), 'operators');

export const useStakersCsv = (sortParams: SortParams<StakersRow>) => {
  const protocolData = useProtocolData();
  const strategies = useStrategies();

  const { data, isFetching, refetch } = useQuery({
    queryKey: ['stakers-csv', sortParams],
    queryFn: async () => {
      if (!protocolData.data || !strategies.data) {
        return Promise.reject(
          new Error('Stakers csv request cannot be sent without strategies data and stakers count.'),
        );
      }

      const stakers = await fetchAllParallel(protocolData.data.stakersCount, (skip) =>
        fetchStakers(`
          first: ${REQUEST_LIMIT}
          skip: ${skip}
        `),
      );

      return stakers.map((staker) => transformToRow(staker, strategies.data.strategyToEthBalance));
    },
    enabled: false,
  });

  const handleCsvDownload = useCallback(() => {
    data
      ? downloadStakersCsv(data, sortParams)
      : refetch().then((res) => (res.data ? downloadStakersCsv(res.data, sortParams) : res));
  }, [data, refetch, sortParams]);

  return {
    isCsvLoading: isFetching,
    handleCsvDownload,
  };
};
