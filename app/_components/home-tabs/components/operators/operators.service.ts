import { useCallback } from 'react';
import { gql } from 'graphql-request';
import { useQuery } from '@tanstack/react-query';
import { compose, map } from 'ramda';

import { OperatorsRow, transformToCsvRow } from './operators.model';

import { SortParams } from '@/app/_models/sort.model';
import { ProtocolEntityMetadata } from '@/app/_models/protocol-entity-metadata.model';
import { fetchStrategiesWithTvl } from '@/app/_services/strategies.service';
import { fetchEntitiesMetadata } from '@/app/_services/entity-metadata.service';
import { fetchAllParallel, request, REQUEST_LIMIT } from '@/app/_services/graphql.service';
import { fetchProtocolData, useProtocolData } from '@/app/_services/protocol-data.service';
import { isTermLongEnough } from '@/app/_utils/account-search.utils';
import { downloadCsv } from '@/app/_utils/csv.utils';
import { sortTableRows } from '@/app/_utils/sort.utils';
import { createStrategyToTvlMap, StrategyToTvlMap } from '@/app/_utils/strategies.utils';

type FetchOperatorsParams = {
  currentPage: number;
  perPage: number;
  sortParams: SortParams<OperatorsRow>;
  idFilters: Array<string> | null;
};

type OperatorServer = {
  id: string;
  delegatorsCount: number;
  registered: string;
  metadataURI: string | null;
  strategies: Array<{
    totalShares: string;
    strategy: {
      id: string;
      totalShares: string;
    };
  }>;
  avsStatuses: Array<{
    avs: {
      id: string;
      metadataURI: string | null;
    };
  }>;
};

export const useOperators = ({ currentPage, perPage, sortParams, idFilters }: FetchOperatorsParams) =>
  useQuery({
    queryKey: ['operators', currentPage, perPage, sortParams, idFilters],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/operators`, {
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

type OperatorsSearchResponse = {
  accountSearch: Array<{
    operator: {
      id: string;
    } | null;
  }>;
};

export const useOperatorsSearch = (searchTerm: string) => {
  return useQuery({
    queryKey: ['operators-search', searchTerm],
    queryFn: async () => {
      const { accountSearch } = await request<OperatorsSearchResponse>(
        gql`
        query {
          accountSearch(
            text: "${searchTerm}:* | 0x${searchTerm}:*",
            first: ${REQUEST_LIMIT}
          ) {
            operator {
              id
            }
          }
        }
      `,
      );

      return accountSearch.flatMap((operator) => operator.operator?.id || []);
    },
    enabled: isTermLongEnough(searchTerm),
  });
};

type OperatorsResponse = {
  operators: Array<OperatorServer>;
};

const _fetchOperators = async (requestOptions: string) => {
  const { operators } = await request<OperatorsResponse>(
    gql`
      query {
        operators(
          ${requestOptions}
        ) {
          id
          delegatorsCount
          registered
          metadataURI
          strategies(
            first: ${REQUEST_LIMIT}
            where: {strategy_not: null, totalShares_gt: "0"}
          ) {
            totalShares
            strategy {
              id
              totalShares
            }
          }
          avsStatuses(
            first: ${REQUEST_LIMIT}
            where: {status: 1}
          ) {
            avs {
              id
              metadataURI
            }
          }
        }
      }
    `,
  );

  const [metadata, logos] = await Promise.all([
    fetchEntitiesMetadata(operators),
    Promise.all(
      operators.flatMap((operator) => {
        return Promise.all(
          operator.avsStatuses.map(async ({ avs }) => {
            if (avs.metadataURI) {
              const res = await fetch(avs.metadataURI);

              const { logo } = await res.json();

              return logo;
            }

            return [];
          }),
        );
      }),
    ),
  ]);

  return operators.map((operator, i) => {
    return {
      ...operator,
      avsLogos: logos[i],
      metadata: metadata[operator.id],
    };
  });
};

const createOperatorsRow = (
  {
    id,
    registered,
    delegatorsCount,
    strategies,
    metadata,
    avsLogos,
  }: OperatorServer & { metadata: ProtocolEntityMetadata; avsLogos: Array<string> },
  strategyToTvl: StrategyToTvlMap,
): OperatorsRow => {
  const { logo, name } = metadata;

  const tvl = strategies.reduce((tvl, { totalShares, strategy }) => {
    tvl += (BigInt(totalShares) * BigInt(strategyToTvl[strategy.id])) / BigInt(strategy.totalShares);
    return tvl;
  }, BigInt(0));

  return {
    key: id,
    id,
    logo,
    name,
    tvl: Number(tvl) / 1e18,
    created: registered,
    delegatorsCount,
    avsLogos,
  };
};

const fetchAllOperatorsParallel = async (operatorsCount: number) => {
  const [stakers, strategies] = await Promise.all([
    fetchAllParallel(operatorsCount, async (skip: number) =>
      _fetchOperators(`
        first: ${REQUEST_LIMIT}
        skip: ${skip}
      `),
    ),
    fetchStrategiesWithTvl(),
  ]);

  const strategyToTvl = createStrategyToTvlMap(strategies);

  return stakers.map((staker) => {
    return createOperatorsRow(staker, strategyToTvl);
  });
};

const downloadOperatorsCsv = (data: Array<OperatorsRow>, sortParams: SortParams<OperatorsRow>) =>
  downloadCsv(compose(map(transformToCsvRow), sortTableRows(sortParams))(data), 'operators');

export const useOperatorsCsv = (sortParams: SortParams<OperatorsRow>) => {
  const { data: protocolData } = useProtocolData();

  const { data, isFetching, refetch } = useQuery({
    queryKey: ['operators-csv', sortParams],
    queryFn: async () => {
      if (!protocolData) {
        return Promise.reject(new Error('Operators csv request cannot be sent without operators count.'));
      }

      return fetchAllOperatorsParallel(protocolData.operatorsCount);
    },
    enabled: false,
  });

  const handleCsvDownload = useCallback(() => {
    data
      ? downloadOperatorsCsv(data, sortParams)
      : refetch().then((res) => (res.data ? downloadOperatorsCsv(res.data, sortParams) : res));
  }, [data, refetch, sortParams]);

  return {
    isCsvLoading: isFetching,
    handleCsvDownload,
  };
};

export const fetchOperators = async ({
  currentPage,
  perPage,
  sortParams,
  idFilters,
}: FetchOperatorsParams) => {
  const [operators, strategies] = await Promise.all([
    _fetchOperators(`
      first: ${perPage}
      skip: ${perPage * (currentPage - 1)}
      orderBy: ${sortParams.orderBy}
      orderDirection: ${sortParams.orderDirection}
      where: ${idFilters ? `{ id_in: ${JSON.stringify(idFilters)} }` : null}
    `),
    fetchStrategiesWithTvl(),
  ]);

  const strategyToTvl = createStrategyToTvlMap(strategies);

  return operators.map((operator) => {
    return createOperatorsRow(operator, strategyToTvl);
  });
};

export const fetchAllOperators = async () => {
  const { operatorsCount } = await fetchProtocolData();

  return fetchAllOperatorsParallel(operatorsCount);
};
