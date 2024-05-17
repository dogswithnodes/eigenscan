import { useCallback } from 'react';
import { gql } from 'graphql-request';
import { useQuery } from '@tanstack/react-query';
import { compose, map } from 'ramda';

import {
  StrategyOperatorsRow,
  StrategyOperator,
  transformToCsvRow,
  transformToRow,
} from './strategy-operators.model';

import { SortParams } from '@/app/_models/sort.model';
import { fetchAllParallel, request, REQUEST_LIMIT } from '@/app/_services/graphql.service';
import { downloadCsv } from '@/app/_utils/csv.utils';
import { sortTableRows } from '@/app/_utils/sort.utils';

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
  const metadata = await Promise.all(
    operatorStrategies.map(({ operator: { metadataURI } }) =>
      metadataURI
        ? fetch(
            `/api/metadata?${new URLSearchParams({
              uri: metadataURI,
            })}`,
          ).then((res) => res.json())
        : null,
    ),
  );

  return operatorStrategies.map((operator, i) => ({
    ...operator,
    logo: metadata[i]?.logo ?? null,
    name: metadata[i]?.name ?? null,
  }));
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
  strategyTotalShares: string,
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

      return operators.map((operator) => transformToRow({ ...operator, balance, strategyTotalShares }));
    },
    placeholderData: (prev) => prev,
  });

const fetchAllStrategyOperatorsParallel = async (
  id: string,
  operatorsCount: number,
  balance: string,
  strategyTotalShares: string,
): Promise<Array<StrategyOperatorsRow>> => {
  const operators = await fetchAllParallel(operatorsCount, async (skip: number) =>
    fetchStrategyOperators(`
      first: ${REQUEST_LIMIT}
      skip: ${skip}
      where: { strategy: ${JSON.stringify(id)} }
    `),
  );

  return operators.map((operator) => transformToRow({ ...operator, balance, strategyTotalShares }));
};
// TODO generic name
const downloadStrategyOperatorsCsv = (
  data: Array<StrategyOperatorsRow>,
  sortParams: SortParams<StrategyOperatorsRow>,
) => downloadCsv(compose(map(transformToCsvRow), sortTableRows(sortParams))(data), 'strategy-operators');

export const useStrategyOperatorsCsv = (
  id: string,
  operatorsCount: number,
  sortParams: SortParams<StrategyOperatorsRow>,
  balance: string,
  strategyTotalShares: string,
) => {
  const { data, isFetching, refetch } = useQuery({
    queryKey: ['strategy-operators-csv', id, sortParams],
    queryFn: async () => {
      return fetchAllStrategyOperatorsParallel(id, operatorsCount, balance, strategyTotalShares);
    },
    enabled: false,
  });

  const handleCsvDownload = useCallback(() => {
    data
      ? downloadStrategyOperatorsCsv(data, sortParams)
      : refetch().then((res) => (res.data ? downloadStrategyOperatorsCsv(res.data, sortParams) : res));
  }, [data, refetch, sortParams]);

  return {
    isCsvLoading: isFetching,
    handleCsvDownload,
  };
};
