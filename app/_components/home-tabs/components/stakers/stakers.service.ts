import { useQuery } from '@tanstack/react-query';
import { gql } from 'graphql-request';
import { useCallback } from 'react';

import { Staker, StakersRow, transformToCsvRow, transformToRow } from './stakers.model';

import { ServerSearchFetchParams } from '../../home-tabs.model';

import { SortParams } from '@/app/_models/sort.model';
import { fetchAllParallel, request, REQUEST_LIMIT } from '@/app/_services/graphql.service';
import { useProtocolData } from '@/app/_services/protocol-data.service';
import { useStrategies } from '@/app/_services/strategies.service';
import { isTermLongEnough } from '@/app/_utils/account-search.utils';
import { downloadTableData } from '@/app/_utils/table-data.utils';

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
              }
            }
          }
        }
      }
    `,
  );

  return stakers;
};

export const useStakers = ({
  currentPage,
  perPage,
  sortParams,
  idFilters,
}: ServerSearchFetchParams<StakersRow>) => {
  const { data } = useStrategies();

  return useQuery({
    enabled: Boolean(data),
    queryKey: ['stakers', currentPage, perPage, sortParams, idFilters],
    queryFn: async () => {
      if (!data) {
        return Promise.reject(new Error('stakers: Insufficient data'));
      }

      const stakers = await fetchStakers(`
        first: ${perPage}
        skip: ${perPage * (currentPage - 1)}
        orderBy: ${sortParams.orderBy}
        orderDirection: ${sortParams.orderDirection}
        where: ${idFilters ? `{ id_in: ${JSON.stringify(idFilters)} }` : null}
      `);

      return stakers.map((staker) => transformToRow(staker, data.strategiesMap));
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

export const useStakersCsv = (sortParams: SortParams<StakersRow>) => {
  const protocolData = useProtocolData();
  const strategies = useStrategies();

  const { data, isFetching, refetch } = useQuery({
    queryKey: ['stakers-csv', sortParams],
    queryFn: async () => {
      if (!protocolData.data || !strategies.data) {
        return Promise.reject(new Error('stakers-csv: Insufficient data'));
      }

      const stakers = await fetchAllParallel(protocolData.data.stakersCount, (skip) =>
        fetchStakers(`
          first: ${REQUEST_LIMIT}
          skip: ${skip}
        `),
      );

      return stakers.map((staker) => transformToRow(staker, strategies.data.strategiesMap));
    },
    enabled: false,
  });

  const handleCsvDownload = useCallback(async () => {
    downloadTableData({
      data: (data ?? (await refetch()).data) || [],
      fileName: 'stakers',
      sortParams,
      transformToCsvRow,
    });
  }, [data, refetch, sortParams]);

  return {
    isCsvLoading: isFetching,
    handleCsvDownload,
  };
};
