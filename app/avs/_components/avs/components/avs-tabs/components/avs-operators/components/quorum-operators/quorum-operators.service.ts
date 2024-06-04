import { useQuery } from '@tanstack/react-query';
import { gql } from 'graphql-request';
import { useCallback } from 'react';

import {
  QuorumOperator,
  QuorumOperatorsRow,
  transformToCsvRow,
  transformToRow,
} from './quorum-operators.model';

import { DEFAULT_METADATA_MAP_KEY } from '@/app/_constants/protocol-entity-metadata.constants';
import { SortParams } from '@/app/_models/sort.model';
import { StrategiesMap } from '@/app/_models/strategies.model';
import { SingleEntityFetchParams } from '@/app/_models/table.model';
import { request, REQUEST_LIMIT, fetchAllParallel } from '@/app/_services/graphql.service';
import { fetchProtocolEntitiesMetadata } from '@/app/_services/protocol-entity-metadata';
import { downloadTableData } from '@/app/_utils/table-data.utils';

type QuorumOperatorsQuorumResponse = {
  operatorQuorums: Array<QuorumOperator>;
};

const fetchQuorumOperators = async (requestParams: string): Promise<Array<QuorumOperator>> => {
  const { operatorQuorums } = await request<QuorumOperatorsQuorumResponse>(gql`
    query {
    operatorQuorums(
      ${requestParams}
    ) {
      operator {
        id
        metadataURI
        totalEigenShares
        strategies(
          first: ${REQUEST_LIMIT}
          where: {strategy_not: null, totalShares_gt: "0"}
        ) {
          totalShares
          strategy {
            id
          }
        }
      }
        totalWeight
      }
    }
  `);

  return operatorQuorums;
};

export const useQuorumOperators = (
  {
    id,
    quorum,
    currentPage,
    perPage,
    sortParams,
  }: SingleEntityFetchParams<QuorumOperatorsRow> & { quorum: number },
  strategiesMap: StrategiesMap,
  quorumWeight: string,
) => {
  return useQuery({
    queryKey: ['quorum-operators', id, quorum, currentPage, perPage, sortParams],
    queryFn: async () => {
      const operators = await fetchQuorumOperators(`
        first: ${perPage}
        skip: ${perPage * (currentPage - 1)}
        orderBy: ${sortParams.orderBy}
        orderDirection: ${sortParams.orderDirection}
        where: {quorum_: {avs: ${JSON.stringify(id)}, quorum: ${quorum}}}
      `);

      const metadata = await fetchProtocolEntitiesMetadata(
        operators.map(({ operator: { metadataURI } }) => metadataURI),
      );

      return operators.map((operator) =>
        transformToRow(
          operator,
          metadata[operator.operator.metadataURI ?? DEFAULT_METADATA_MAP_KEY],
          strategiesMap,
          quorumWeight,
        ),
      );
    },
    placeholderData: (prev) => prev,
  });
};

const fetchAllQuorumOperators = async (
  id: string,
  quorum: number,
  quorumWeight: string,
  operatorsCount: number,
  strategiesMap: StrategiesMap,
): Promise<Array<QuorumOperatorsRow>> => {
  const operators = await fetchAllParallel(operatorsCount, async (skip: number) => {
    return fetchQuorumOperators(`
      first: ${REQUEST_LIMIT}
      skip: ${skip}
      where: {quorum_: {avs: ${JSON.stringify(id)}, quorum: ${quorum}}}
    `);
  });

  const metadata = await fetchProtocolEntitiesMetadata(
    operators.map(({ operator: { metadataURI } }) => metadataURI),
  );

  return operators.map((operator) =>
    transformToRow(
      operator,
      metadata[operator.operator.metadataURI ?? DEFAULT_METADATA_MAP_KEY],
      strategiesMap,
      quorumWeight,
    ),
  );
};

export const useQuorumOperatorsCsv = (
  id: string,
  operatorsCount: number,
  quorum: number,
  quorumWeight: string,
  sortParams: SortParams<QuorumOperatorsRow>,
  strategiesMap: StrategiesMap,
) => {
  const { data, isFetching, refetch } = useQuery({
    queryKey: ['quorum-operators-csv', id, quorum, sortParams],
    queryFn: async () => {
      return fetchAllQuorumOperators(id, quorum, quorumWeight, operatorsCount, strategiesMap);
    },
    enabled: false,
  });

  const handleCsvDownload = useCallback(async () => {
    downloadTableData({
      data: (data ?? (await refetch()).data) || [],
      fileName: 'quorum-operators',
      sortParams,
      transformToCsvRow,
    });
  }, [data, refetch, sortParams]);

  return {
    isCsvLoading: isFetching,
    handleCsvDownload,
  };
};
