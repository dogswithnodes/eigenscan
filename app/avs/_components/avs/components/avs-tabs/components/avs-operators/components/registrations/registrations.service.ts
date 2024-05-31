import { useQuery } from '@tanstack/react-query';
import { gql } from 'graphql-request';
import { useCallback } from 'react';

import { Registration, RegistrationsRow, transformToCsvRow, transformToRow } from './registrations.model';

import { DEFAULT_METADATA_MAP_KEY } from '@/app/_constants/protocol-entity-metadata.constants';
import { SortParams } from '@/app/_models/sort.model';
import { StrategiesMap } from '@/app/_models/strategies.model';
import { FetchParams } from '@/app/_models/table.model';
import { request, REQUEST_LIMIT, fetchAllParallel } from '@/app/_services/graphql.service';
import { fetchProtocolEntitiesMetadata } from '@/app/_services/protocol-entity-metadata.service';
import { downloadTableData } from '@/app/_utils/table-data.utils';

type RegistrationsFetchParams = FetchParams<RegistrationsRow> & {
  id: string;
};

type RegistrationsResponse = {
  avsoperatorStatuses: Array<Registration>;
};

const fetchRegistrations = async (requestParams: string): Promise<Array<Registration>> => {
  const { avsoperatorStatuses } = await request<RegistrationsResponse>(gql`
    query {
      avsoperatorStatuses(
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
      }
    }
  `);

  return avsoperatorStatuses;
};

export const useRegistrations = (
  { id, currentPage, perPage, sortParams }: RegistrationsFetchParams,
  strategiesMap: StrategiesMap,
) => {
  return useQuery({
    queryKey: ['registrations', id, currentPage, perPage, sortParams],
    queryFn: async () => {
      const registrations = await fetchRegistrations(`
        first: ${perPage}
        skip: ${perPage * (currentPage - 1)}
        orderBy: ${sortParams.orderBy}
        orderDirection: ${sortParams.orderDirection}
        where: {avs: ${JSON.stringify(id)}}
      `);

      const metadata = await fetchProtocolEntitiesMetadata(
        registrations.map(({ operator }) => operator.metadataURI),
      );

      return registrations.map((registration) =>
        transformToRow(
          registration,
          metadata[registration.operator.metadataURI ?? DEFAULT_METADATA_MAP_KEY],
          strategiesMap,
        ),
      );
    },
    placeholderData: (prev) => prev,
  });
};

const fetchAllRegistrations = async (
  id: string,
  operatorsCount: number,
  strategiesMap: StrategiesMap,
): Promise<Array<RegistrationsRow>> => {
  const registrations = await fetchAllParallel(operatorsCount, async (skip: number) => {
    return fetchRegistrations(`
      first: ${REQUEST_LIMIT}
      skip: ${skip}
      where: {avs: ${JSON.stringify(id)}}
    `);
  });

  const metadata = await fetchProtocolEntitiesMetadata(
    registrations.map(({ operator }) => operator.metadataURI),
  );

  return registrations.map((registration) =>
    transformToRow(
      registration,
      metadata[registration.operator.metadataURI ?? DEFAULT_METADATA_MAP_KEY],
      strategiesMap,
    ),
  );
};

export const useRegistrationsCsv = (
  id: string,
  operatorsCount: number,
  sortParams: SortParams<RegistrationsRow>,
  strategiesMap: StrategiesMap,
) => {
  const { data, isFetching, refetch } = useQuery({
    queryKey: ['registrations-csv', id, sortParams],
    queryFn: async () => {
      return fetchAllRegistrations(id, operatorsCount, strategiesMap);
    },
    enabled: false,
  });

  const handleCsvDownload = useCallback(async () => {
    downloadTableData({
      data: (data ?? (await refetch()).data) || [],
      fileName: 'registrations',
      sortParams,
      transformToCsvRow,
    });
  }, [data, refetch, sortParams]);

  return {
    isCsvLoading: isFetching,
    handleCsvDownload,
  };
};
