import { useQuery } from '@tanstack/react-query';
import { gql } from 'graphql-request';

import { AVSOperator, Quorum } from './avs.model';

import { DEFAULT_METADATA_MAP_KEY } from '@/app/_constants/protocol-entity-metadata.constants';
import { REQUEST_LIMIT, request } from '@/app/_services/graphql.service';
import { fetchProtocolEntitiesMetadata } from '@/app/_services/protocol-entity-metadata';

type AVSResponse = {
  avs: {
    id: string;
    metadataURI: string | null;
    created: string;
    registrationsCount: number;
    actionsCount: number;
    quorums: Array<Quorum>;
    registrations: Array<AVSOperator>;
    stakeRegistry: { id: string } | null;
    blsApkRegistry: { id: string } | null;
  };
};

export const useAVS = (id: string) => {
  return useQuery({
    queryKey: ['avs', id],
    queryFn: async () => {
      const { avs } = await request<AVSResponse>(gql`
        query {
          avs(id: ${JSON.stringify(id)}) {
            id
            metadataURI
            created
            registrationsCount
            actionsCount
            quorums(
              first: ${REQUEST_LIMIT}
              where: {multipliersCount_gt: 0}
            ) {
              minimalStake
              multipliers(
                first: ${REQUEST_LIMIT},
              ) {
                id
                multiply
                strategy {
                  id
                }
              }
              operators(
                first: ${REQUEST_LIMIT}
              ) {
                totalWeight
                operator {
                  id
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
              operatorsCount
              quorum
            }
            registrations(
              first: ${REQUEST_LIMIT},
              where: {status: 1}
            ) {
              operator {
                id
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
            blsApkRegistry {
              id
            }
            stakeRegistry {
              id
            }
          }
        }
      `);

      if (!avs) return null;

      const metadata = await fetchProtocolEntitiesMetadata([avs.metadataURI]);

      return {
        ...avs,
        ...metadata[avs.metadataURI ?? DEFAULT_METADATA_MAP_KEY],
      };
    },
  });
};
