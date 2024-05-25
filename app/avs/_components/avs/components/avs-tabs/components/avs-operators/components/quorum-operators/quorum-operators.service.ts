import { useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { gql } from 'graphql-request';
import { compose, map } from 'ramda';

import {
  QuorumOperator,
  QuorumOperatorsRow,
  transformToCsvRow,
  transformToRow,
} from './quorum-operators.model';

import { DEFAULT_METADATA_MAP_KEY } from '@/app/_constants/protocol-entity-metadata.constants';
import { FetchParams } from '@/app/_models/table.model';
import { StrategyToEthBalance } from '@/app/_models/strategies.model';
import { SortParams } from '@/app/_models/sort.model';
import { request, REQUEST_LIMIT, fetchAllParallel } from '@/app/_services/graphql.service';
import { fetchProtocolEntitiesMetadata } from '@/app/_services/protocol-entity-metadata';
import { downloadCsv as _downloadCsv } from '@/app/_utils/csv.utils';
import { sortTableRows } from '@/app/_utils/sort.utils';

type QuorumOperatorsFetchParams = FetchParams<QuorumOperatorsRow> & {
  avsId: string;
  quorum: number;
};

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
            totalShares
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
  { avsId, quorum, currentPage, perPage, sortParams }: QuorumOperatorsFetchParams,
  strategyToEthBalance: StrategyToEthBalance,
  quorumWeight: string,
) => {
  return useQuery({
    queryKey: ['quorum-operators', avsId, quorum, currentPage, perPage, sortParams],
    queryFn: async () => {
      const operators = await fetchQuorumOperators(`
        first: ${perPage}
        skip: ${perPage * (currentPage - 1)}
        orderBy: ${sortParams.orderBy}
        orderDirection: ${sortParams.orderDirection}
        where: {quorum_: {avs: ${JSON.stringify(avsId)}, quorum: ${quorum}}}
      `);

      const metadata = await fetchProtocolEntitiesMetadata(
        operators.map(({ operator: { metadataURI } }) => metadataURI),
      );

      return operators.map((operator) =>
        transformToRow(
          operator,
          metadata[operator.operator.metadataURI ?? DEFAULT_METADATA_MAP_KEY],
          strategyToEthBalance,
          quorumWeight,
        ),
      );
    },
    placeholderData: (prev) => prev,
  });
};

const fetchAllQuorumOperators = async (
  avsId: string,
  quorum: number,
  quorumWeight: string,
  operatorsCount: number,
  strategyToEthBalance: StrategyToEthBalance,
): Promise<Array<QuorumOperatorsRow>> => {
  const operators = await fetchAllParallel(operatorsCount, async (skip: number) => {
    return fetchQuorumOperators(`
      first: ${REQUEST_LIMIT}
      skip: ${skip}
      where: {quorum_: {avs: ${JSON.stringify(avsId)}, quorum: ${quorum}}}
    `);
  });

  const metadata = await fetchProtocolEntitiesMetadata(
    operators.map(({ operator: { metadataURI } }) => metadataURI),
  );

  return operators.map((operator) =>
    transformToRow(
      operator,
      metadata[operator.operator.metadataURI ?? DEFAULT_METADATA_MAP_KEY],
      strategyToEthBalance,
      quorumWeight,
    ),
  );
};

const downloadCsv = (data: Array<QuorumOperatorsRow>, sortParams: SortParams<QuorumOperatorsRow>) =>
  _downloadCsv(compose(map(transformToCsvRow), sortTableRows(sortParams))(data), 'avs-operators');

export const useQuorumOperatorsCsv = (
  avsId: string,
  operatorsCount: number,
  quorum: number,
  quorumWeight: string,
  sortParams: SortParams<QuorumOperatorsRow>,
  strategyToEthBalance: StrategyToEthBalance,
) => {
  const { data, isFetching, refetch } = useQuery({
    queryKey: ['quorum-operators-csv', avsId, quorum, sortParams],
    queryFn: async () => {
      return fetchAllQuorumOperators(avsId, quorum, quorumWeight, operatorsCount, strategyToEthBalance);
    },
    enabled: false,
  });

  const handleCsvDownload = useCallback(() => {
    data
      ? downloadCsv(data, sortParams)
      : refetch().then((res) => (res.data ? downloadCsv(res.data, sortParams) : res));
  }, [data, refetch, sortParams]);

  return {
    isCsvLoading: isFetching,
    handleCsvDownload,
  };
};
