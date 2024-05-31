import { useQuery } from '@tanstack/react-query';
import { gql } from 'graphql-request';

import { DEFAULT_METADATA_MAP_KEY } from '@/app/_constants/protocol-entity-metadata.constants';
import { request } from '@/app/_services/graphql.service';
import { fetchProtocolEntitiesMetadata } from '@/app/_services/protocol-entity-metadata.service';

type TopWeightOperatorsResponse = {
  operators: Array<{
    id: string;
    metadataURI: string | null;
  }>;
};

export const useTopWeightOperatorsNames = (operatorsIds: Array<string> | undefined) => {
  return useQuery({
    enabled: Array.isArray(operatorsIds) && operatorsIds.length > 0,
    queryKey: ['top-weight-operators-names', operatorsIds],
    queryFn: async () => {
      if (!operatorsIds) throw 'top-weight-operators-names: Insufficient data';

      const { operators } = await request<TopWeightOperatorsResponse>(gql`
        query {
          operators(
            first: ${operatorsIds.length}
            where: {id_in: ${JSON.stringify(operatorsIds)}}
          ) {
            id
            metadataURI
          }
        }
      `);

      const metadata = await fetchProtocolEntitiesMetadata(operators.map(({ metadataURI }) => metadataURI));

      return operators.reduce<Record<string, string>>((acc, { id, metadataURI }) => {
        acc[id] = metadata[metadataURI ?? DEFAULT_METADATA_MAP_KEY].name || id;
        return acc;
      }, {});
    },
  });
};
