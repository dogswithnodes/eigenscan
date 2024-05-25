import { gql } from 'graphql-request';
import { useQuery } from '@tanstack/react-query';

import { OperatorAVSs, OperatorAVSsEnriched, transformToRows } from './operator-avss.model';

import { DEFAULT_METADATA_MAP_KEY } from '@/app/_constants/protocol-entity-metadata.constants';
import { request, REQUEST_LIMIT } from '@/app/_services/graphql.service';
import { fetchProtocolEntitiesMetadata } from '@/app/_services/protocol-entity-metadata';

type OperatorAVSsResponse = {
  operator: OperatorAVSs;
};

const fetchOperatorAVSs = async (id: string): Promise<OperatorAVSsEnriched> => {
  const { operator } = await request<OperatorAVSsResponse>(
    gql`
      query {
        operator(
          id: ${JSON.stringify(id)}
        ) {
          quorums(
            first: ${REQUEST_LIMIT}
            where: {quorum_not: null}
          ) {
            totalWeight
            quorum {
              quorum
              avs {
                id
              }
            }
          }
          avsStatuses(
            first: ${REQUEST_LIMIT}
            where: {status: 1}
          ) {
            id
            operator {
              registered
            }
            avs {
              id
              metadataURI
            }
          }
        }
      }
    `,
  );

  const avssMetadata = await fetchProtocolEntitiesMetadata(
    operator.avsStatuses.map(({ avs }) => avs.metadataURI),
  );

  return {
    ...operator,
    avsStatuses: operator.avsStatuses.map((avsStatus) => {
      const { logo, name } = avssMetadata[avsStatus.avs.metadataURI ?? DEFAULT_METADATA_MAP_KEY];
      return {
        ...avsStatus,
        logo,
        name,
      };
    }),
  };
};

export const useOperatorAVSs = (id: string) => {
  return useQuery({
    queryKey: ['operator-avss'],
    queryFn: async () => {
      return transformToRows(await fetchOperatorAVSs(id));
    },
  });
};
