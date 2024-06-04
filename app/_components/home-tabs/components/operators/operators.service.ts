import { useQuery } from '@tanstack/react-query';
import { gql } from 'graphql-request';
import { useCallback } from 'react';

import {
  Operator,
  OperatorEnriched,
  OperatorsRow,
  transformToCsvRow,
  transformToRow,
} from './operators.model';

import { ServerSearchFetchParams } from '../../home-tabs.model';

import { DEFAULT_METADATA_MAP_KEY } from '@/app/_constants/protocol-entity-metadata.constants';
import { SortParams } from '@/app/_models/sort.model';
import { fetchAllParallel, request, REQUEST_LIMIT } from '@/app/_services/graphql.service';
import { useProtocolData } from '@/app/_services/protocol-data.service';
import { fetchProtocolEntitiesMetadata } from '@/app/_services/protocol-entity-metadata';
import { useStrategies } from '@/app/_services/strategies.service';
import { isTermLongEnough } from '@/app/_utils/account-search.utils';
import { downloadTableData } from '@/app/_utils/table-data.utils';

type OperatorsResponse = {
  operators: Array<Operator>;
};

const fetchOperators = async (requestOptions: string): Promise<Array<OperatorEnriched>> => {
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

  const metadata = await fetchProtocolEntitiesMetadata([
    ...operators.map((operator) => operator.metadataURI),
    ...operators.flatMap((operator) => operator.avsStatuses.flatMap(({ avs }) => avs.metadataURI ?? [])),
  ]);

  return operators.map((operator) => {
    const { logo, name } = metadata[operator.metadataURI ?? DEFAULT_METADATA_MAP_KEY];

    return {
      ...operator,
      avsLogos: operator.avsStatuses.flatMap(({ avs }) =>
        avs.metadataURI ? metadata[avs.metadataURI].logo : [],
      ),
      logo,
      name,
    };
  });
};

export const useOperators = ({
  currentPage,
  perPage,
  sortParams,
  idFilters,
}: ServerSearchFetchParams<OperatorsRow>) => {
  const { data } = useStrategies();

  return useQuery({
    enabled: Boolean(data),
    queryKey: ['operators', currentPage, perPage, sortParams, idFilters],
    queryFn: async () => {
      if (!data) {
        return Promise.reject(new Error('operators: Insufficient data'));
      }

      const operators = await fetchOperators(`
        first: ${perPage}
        skip: ${perPage * (currentPage - 1)}
        orderBy: ${sortParams.orderBy}
        orderDirection: ${sortParams.orderDirection}
        where: ${idFilters ? `{ id_in: ${JSON.stringify(idFilters)} }` : null}
      `);

      return operators.map((operator) => transformToRow(operator, data.strategiesMap));
    },
    placeholderData: (prev) => prev,
  });
};

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

export const useOperatorsCsv = (sortParams: SortParams<OperatorsRow>) => {
  const strategies = useStrategies();
  const protocolData = useProtocolData();

  const { data, isFetching, refetch } = useQuery({
    queryKey: ['operators-csv', sortParams],
    queryFn: async () => {
      if (!protocolData.data || !strategies.data) {
        return Promise.reject(new Error('operators-csv: Insufficient data'));
      }

      const operators = await fetchAllParallel(protocolData.data.operatorsCount, (skip) =>
        fetchOperators(`
          first: ${REQUEST_LIMIT}
          skip: ${skip}
        `),
      );

      return operators.map((operator) => transformToRow(operator, strategies.data.strategiesMap));
    },
    enabled: false,
  });

  const handleCsvDownload = useCallback(async () => {
    downloadTableData({
      data: (data ?? (await refetch()).data) || [],
      fileName: 'operators',
      sortParams,
      transformToCsvRow,
    });
  }, [data, refetch, sortParams]);

  return {
    isCsvLoading: isFetching,
    handleCsvDownload,
  };
};
