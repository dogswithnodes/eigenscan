import { useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { gql } from 'graphql-request';
import { compose, map } from 'ramda';

import { Registration, RegistrationsRow, transformToCsvRow, transformToRow } from './registrations.model';

import { FetchParams } from '@/app/_models/table.model';
import { StrategyToEthBalance } from '@/app/_models/strategies.model';
import { request, REQUEST_LIMIT, fetchAllParallel } from '@/app/_services/graphql.service';
import { fetchProtocolEntitiesMetadata } from '@/app/_services/protocol-entity-metadata';
import { downloadCsv as _downloadCsv } from '@/app/_utils/csv.utils';
import { sortTableRows } from '@/app/_utils/sort.utils';
import { SortParams } from '@/app/_models/sort.model';

type RegistrationsFetchParams = FetchParams<RegistrationsRow> & {
  avsId: string;
};

type RegistrationsResponse = {
  operators: Array<Registration>;
};

const fetchRegistrations = async (requestParams: string): Promise<Array<Registration>> => {
  const { operators } = await request<RegistrationsResponse>(gql`
    query {
      operators(
        ${requestParams}
      ) {
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
    }
  `);

  return operators;
};

export const useRegistrations = (
  { avsId, currentPage, perPage, sortParams }: RegistrationsFetchParams,
  strategyToEthBalance: StrategyToEthBalance,
) => {
  return useQuery({
    queryKey: ['registrations', avsId, currentPage, perPage, sortParams],
    queryFn: async () => {
      const operators = await fetchRegistrations(`
        first: ${perPage}
        skip: ${perPage * (currentPage - 1)}
        orderBy: ${sortParams.orderBy}
        orderDirection: ${sortParams.orderDirection}
        where: {avsStatuses_: {avs: ${JSON.stringify(avsId)}}}
      `);

      const metadata = await fetchProtocolEntitiesMetadata(operators.map(({ metadataURI }) => metadataURI));

      return operators.map((operator, i) => transformToRow(operator, metadata[i], strategyToEthBalance));
    },
    placeholderData: (prev) => prev,
  });
};

const fetchAllRegistrations = async (
  avsId: string,
  operatorsCount: number,
  strategyToEthBalance: StrategyToEthBalance,
): Promise<Array<RegistrationsRow>> => {
  const operators = await fetchAllParallel(operatorsCount, async (skip: number) => {
    return fetchRegistrations(`
      first: ${REQUEST_LIMIT}
      skip: ${skip}
      where: {avsStatuses_: {avs: ${JSON.stringify(avsId)}}}
    `);
  });

  const metadata = await fetchProtocolEntitiesMetadata(operators.map(({ metadataURI }) => metadataURI));

  return operators.map((operator, i) => transformToRow(operator, metadata[i], strategyToEthBalance));
};

const downloadCsv = (data: Array<RegistrationsRow>, sortParams: SortParams<RegistrationsRow>) =>
  _downloadCsv(compose(map(transformToCsvRow), sortTableRows(sortParams))(data), 'registrations');

export const useRegistrationsCsv = (
  avsId: string,
  operatorsCount: number,
  sortParams: SortParams<RegistrationsRow>,
  strategyToEthBalance: StrategyToEthBalance,
) => {
  const { data, isFetching, refetch } = useQuery({
    queryKey: ['avs-operators-csv', avsId, sortParams],
    queryFn: async () => {
      return fetchAllRegistrations(avsId, operatorsCount, strategyToEthBalance);
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
