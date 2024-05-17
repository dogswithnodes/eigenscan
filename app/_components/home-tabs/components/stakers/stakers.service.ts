import { useCallback } from 'react';
import { gql } from 'graphql-request';
import { useQuery } from '@tanstack/react-query';
import { compose, map } from 'ramda';

import { StakersRow, transformToCsvRow } from './stakers.model';

import { EIGEN_STRATEGY } from '@/app/_constants/addresses.constants';
import { SortParams } from '@/app/_models/sort.model';
import { fetchAllParallel, request, REQUEST_LIMIT } from '@/app/_services/graphql.service';
import { fetchProtocolData, useProtocolData } from '@/app/_services/protocol-data.service';
import { downloadCsv } from '@/app/_utils/csv.utils';
import { sortTableRows } from '@/app/_utils/sort.utils';
import { fetchStrategiesWithTvl } from '@/app/_services/strategies.service';
import { createStrategyToTvlMap, StrategyToTvlMap } from '@/app/_utils/strategies.utils';
import { isTermLongEnough } from '@/app/_utils/account-search.utils';

// TODO generic
type FetchStakersParams = {
  currentPage: number;
  perPage: number;
  sortParams: SortParams<StakersRow>;
  idFilters: Array<string> | null;
};

export const useStakers = ({ currentPage, perPage, sortParams, idFilters }: FetchStakersParams) =>
  useQuery({
    queryKey: ['stakers', currentPage, perPage, sortParams, idFilters],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/stakers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          perPage,
          currentPage,
          sortParams,
          idFilters,
        }),
      });

      return res.json();
    },
    placeholderData: (prev) => prev,
  });

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

type StakerServer = {
  id: string;
  totalEigenWithdrawalsShares: string;
  totalEigenShares: string;
  delegator: {
    operator: {
      id: string;
    } | null;
  } | null;
  stakes: Array<{
    id: string;
    lastUpdatedTimestamp: string;
    shares: string;
    strategy: {
      id: string;
      totalShares: string;
    };
  }>;
  withdrawals: Array<{
    id: string;
    queuedBlockTimestamp: string | null;
    strategies: Array<{
      share: string;
      strategy: {
        id: string;
        totalShares: string;
      };
    }>;
  }>;
};

type StakersResponse = {
  stakers: Array<StakerServer>;
};

const _fetchStakers = async (requestOptions: string) => {
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

const createStakersRow = (
  { id, delegator, stakes, withdrawals, totalEigenShares, totalEigenWithdrawalsShares }: StakerServer,
  strategyToTvl: StrategyToTvlMap,
): StakersRow => {
  const stakedEth = stakes.reduce((acc, { shares, strategy }) => {
    if (strategy.id !== EIGEN_STRATEGY) {
      acc += (BigInt(shares) * BigInt(strategyToTvl[strategy.id])) / BigInt(strategy.totalShares);
    }

    return acc;
  }, BigInt(0));

  const totalWithdrawalsEth = withdrawals.reduce((total, { strategies }) => {
    strategies.forEach(({ share, strategy }) => {
      total += (BigInt(share) * BigInt(strategyToTvl[strategy.id])) / BigInt(strategy.totalShares);
    });

    return total;
  }, BigInt(0));

  return {
    key: id,
    id,
    delegatedTo: delegator?.operator?.id || null,
    totalShares: Number(stakedEth) / 1e18,
    totalWithdrawalsShares: Number(totalWithdrawalsEth) / 1e18,
    totalEigenShares: Number(totalEigenShares) / 1e18,
    totalEigenWithdrawalsShares: Number(totalEigenWithdrawalsShares) / 1e18,
    lastDelegatedAt: stakes.at(0)?.lastUpdatedTimestamp || null,
    lastUndelegatedAt: withdrawals.at(0)?.queuedBlockTimestamp || null,
  };
};

const fetchAllStakersParallel = async (stakersCount: number): Promise<Array<StakersRow>> => {
  const [stakers, strategies] = await Promise.all([
    fetchAllParallel(stakersCount, async (skip: number) =>
      _fetchStakers(`
      first: ${REQUEST_LIMIT}
      skip: ${skip}
    `),
    ),
    fetchStrategiesWithTvl(),
  ]);

  const strategyToTvl = createStrategyToTvlMap(strategies);

  return stakers.map((staker) => {
    return createStakersRow(staker, strategyToTvl);
  });
};

const downloadStakersCsv = (data: Array<StakersRow>, sortParams: SortParams<StakersRow>) =>
  downloadCsv(compose(map(transformToCsvRow), sortTableRows(sortParams))(data), 'operators');

export const useStakersCsv = (sortParams: SortParams<StakersRow>) => {
  const { data: protocolData } = useProtocolData();

  const { data, isFetching, refetch } = useQuery({
    queryKey: ['stakers-csv', sortParams],
    queryFn: async () => {
      if (!protocolData) {
        return Promise.reject(new Error('Stakers csv request cannot be sent without stakers count.'));
      }

      return fetchAllStakersParallel(protocolData.stakersCount);
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

export const fetchStakers = async ({
  currentPage,
  perPage,
  sortParams,
  idFilters,
}: FetchStakersParams): Promise<Array<StakersRow>> => {
  const [stakers, strategies] = await Promise.all([
    _fetchStakers(`
    first: ${perPage}
    skip: ${perPage * (currentPage - 1)}
    orderBy: ${sortParams.orderBy}
    orderDirection: ${sortParams.orderDirection}
    where: ${idFilters ? `{ id_in: ${JSON.stringify(idFilters)} }` : null}
  `),
    fetchStrategiesWithTvl(),
  ]);

  const strategyToTvl = createStrategyToTvlMap(strategies);

  return stakers.map((staker) => {
    return createStakersRow(staker, strategyToTvl);
  });
};

export const fetchAllStakers = async () => {
  const { stakersCount } = await fetchProtocolData();

  return fetchAllStakersParallel(stakersCount);
};
