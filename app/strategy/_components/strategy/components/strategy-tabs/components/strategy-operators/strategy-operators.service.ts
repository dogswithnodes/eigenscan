import { useQuery } from '@tanstack/react-query';
import { gql } from 'graphql-request';
import { useCallback } from 'react';

import {
  StrategyOperatorsRow,
  StrategyOperator,
  transformToCsvRow,
  transformToRow,
} from './strategy-operators.model';

import { DEFAULT_METADATA_MAP_KEY } from '@/app/_constants/protocol-entity-metadata.constants';
import { SortParams } from '@/app/_models/sort.model';
import { fetchAllParallel, request, REQUEST_LIMIT } from '@/app/_services/graphql.service';
import { fetchProtocolEntitiesMetadata } from '@/app/_services/protocol-entity-metadata.service';
import { downloadTableData } from '@/app/_utils/table-data.utils';

type StrategyOperatorsResponse = {
  operatorStrategies: Array<StrategyOperator>;
};

const fetchStrategyOperators = async (requestOptions: string) => {
  const { operatorStrategies } = await request<StrategyOperatorsResponse>(
    gql`
      query {
        operatorStrategies(
          ${requestOptions}
        ) {
          operator {
            id
            metadataURI
          }
          totalShares
          delegationsCount
        }
      }
    `,
  );

  const metadata = await fetchProtocolEntitiesMetadata(
    operatorStrategies.map(({ operator: { metadataURI } }) => metadataURI),
  );

  return operatorStrategies.map((operator) => {
    const { logo, name } = metadata[operator.operator.metadataURI ?? DEFAULT_METADATA_MAP_KEY];

    return {
      ...operator,
      logo,
      name,
    };
  });
};

// TODO generic
type FetchStrategyOperatorsParams = {
  id: string;
  currentPage: number;
  perPage: number;
  sortParams: SortParams<StrategyOperatorsRow>;
};

export const useStrategyOperators = (
  { id, currentPage, perPage, sortParams }: FetchStrategyOperatorsParams,
  balance: string,
  totalSharesAndWithdrawing: string,
) =>
  useQuery({
    queryKey: ['strategy-operators', currentPage, perPage, sortParams],
    queryFn: async () => {
      const operators = await fetchStrategyOperators(`
        first: ${perPage}
        skip: ${perPage * (currentPage - 1)}
        orderBy: ${sortParams.orderBy}
        orderDirection: ${sortParams.orderDirection}
        where: { strategy: ${JSON.stringify(id)} }
      `);

      return operators.map((operator) => transformToRow({ ...operator, balance, totalSharesAndWithdrawing }));
    },
    placeholderData: (prev) => prev,
  });

const fetchAllStrategyOperators = async (
  id: string,
  operatorsCount: number,
  balance: string,
  totalSharesAndWithdrawing: string,
): Promise<Array<StrategyOperatorsRow>> => {
  const operators = await fetchAllParallel(operatorsCount, async (skip: number) =>
    fetchStrategyOperators(`
      first: ${REQUEST_LIMIT}
      skip: ${skip}
      where: { strategy: ${JSON.stringify(id)} }
    `),
  );

  return operators.map((operator) => transformToRow({ ...operator, balance, totalSharesAndWithdrawing }));
};

export const useStrategyOperatorsCsv = (
  id: string,
  operatorsCount: number,
  sortParams: SortParams<StrategyOperatorsRow>,
  balance: string,
  totalSharesAndWithdrawing: string,
) => {
  const { data, isFetching, refetch } = useQuery({
    queryKey: ['strategy-operators-csv', id, sortParams],
    queryFn: async () => {
      return fetchAllStrategyOperators(id, operatorsCount, balance, totalSharesAndWithdrawing);
    },
    enabled: false,
  });

  const handleCsvDownload = useCallback(async () => {
    downloadTableData({
      data: (data ?? (await refetch()).data) || [],
      fileName: 'strategy-operators',
      sortParams,
      transformToCsvRow,
    });
  }, [data, refetch, sortParams]);

  return {
    isCsvLoading: isFetching,
    handleCsvDownload,
  };
};
