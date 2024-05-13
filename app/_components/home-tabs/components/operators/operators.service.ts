import { useCallback } from 'react';
import { gql } from 'graphql-request';
import { useQuery } from '@tanstack/react-query';
import { compose, map } from 'ramda';

import { OperatorsRow, transformToCsvRow } from './operators.model';

import { SortParams } from '@/app/_models/sort.model';
import { fetchEntitiesMetadata } from '@/app/_services/entity-metadata.service';
import { fetchAllParallel, request, REQUEST_LIMIT } from '@/app/_services/graphql.service';
import { fetchProtocolData, useProtocolData } from '@/app/_services/protocol-data.service';
import { isTermLongEnough } from '@/app/_utils/account-search.utils';
import { downloadCsv } from '@/app/_utils/csv.utils';
import { sortTableRows } from '@/app/_utils/sort.utils';

type FetchOperatorsParams = {
  currentPage: number;
  perPage: number;
  sortParams: SortParams<OperatorsRow>;
  idFilters: Array<string> | null;
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
  operators: Array<{
    id: string;
    delegationsCount: number;
    registered: string;
    metadataURI: string | null;
    avsStatuses: Array<{
      avs: {
        id: string;
        metadataURI: string | null;
      };
    }>;
  }>;
};

const operatorFragment = gql`
  fragment OperatorFragment on Operator {
    id
    delegationsCount
    registered
    metadataURI
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
`;

const _fetchOperators = async (requestOptions: string): Promise<Array<OperatorsRow>> => {
  const { operators } = await request<OperatorsResponse>(
    gql`
      ${operatorFragment}
      query {
        operators(
          ${requestOptions}
        ) {
          ...OperatorFragment
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

  return operators.map(({ id, registered, delegationsCount }, i) => {
    const { name, logo } = metadata[id];

    return {
      key: id,
      id,
      logo,
      name,
      created: registered,
      stakersCount: delegationsCount,
      tvl: Number(BigInt(0) / BigInt(1e18)),
      avsLogos: logos[i],
    };
  });
};

const fetchAllOperatorsParallel = (operatorsCount: number) =>
  fetchAllParallel(operatorsCount, async (skip: number) =>
    _fetchOperators(`
    first: ${REQUEST_LIMIT}
    skip: ${skip}
  `),
  );

const downloadOperatorsCsv = (data: Array<OperatorsRow>, sortParams: SortParams<OperatorsRow>) =>
  downloadCsv(compose(map(transformToCsvRow), sortTableRows(sortParams))(data), 'operators');

export const useOperatorsCsv = (sortParams: SortParams<OperatorsRow>) => {
  const { data: protocolData } = useProtocolData();

  const { data, isFetching, refetch } = useQuery({
    queryKey: ['operators-csv'],
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

export const fetchOperators = async ({ currentPage, perPage, sortParams, idFilters }: FetchOperatorsParams) =>
  _fetchOperators(`
    first: ${perPage}
    skip: ${perPage * (currentPage - 1)}
    orderBy: ${sortParams.orderBy}
    orderDirection: ${sortParams.orderDirection}
    where: ${idFilters ? `{ id_in: ${JSON.stringify(idFilters)} }` : null}
  `);

export const fetchAllOperators = async () => {
  const { operatorsCount } = await fetchProtocolData();

  return fetchAllOperatorsParallel(operatorsCount);
};
