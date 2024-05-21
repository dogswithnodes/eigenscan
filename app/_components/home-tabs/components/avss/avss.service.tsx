import { gql } from 'graphql-request';
import { useQuery } from '@tanstack/react-query';

import { AVS, AVSEnriched, transformToRow } from './avss.model';

import { fetchAllParallel, request, REQUEST_LIMIT } from '@/app/_services/graphql.service';
import { useProtocolData } from '@/app/_services/protocol-data.service';
import { fetchProtocolEntitiesMetadata } from '@/app/_services/protocol-entity-metadata';
import { useStrategies } from '@/app/_services/strategies.service';

type AVSsResponse = {
  avss: Array<AVS>;
};

const fetchAVSs = async (requestOptions: string): Promise<Array<AVSEnriched>> => {
  const { avss } = await request<AVSsResponse>(
    gql`
      query {
        avss(
          ${requestOptions}
        ) {
          created
          id
          metadataURI
          registrationsCount
          quorums(
            first: ${REQUEST_LIMIT}
            where: {multipliersCount_gt: 0}
          ) {
            multipliers(
              first: ${REQUEST_LIMIT},
            ) {
              strategy {
                id
              }
            }
            operators(
              first: ${REQUEST_LIMIT}
            ) {
              operator {
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
            operatorsCount
          }
          registrations(
            first: ${REQUEST_LIMIT},
            where: {status: 1}
          ) {
            operator {
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
        }
      }
    `,
  );

  const metadata = await fetchProtocolEntitiesMetadata(avss.map(({ metadataURI }) => metadataURI));

  return avss.map((avs, i) => {
    const { logo, name } = metadata[i];

    return {
      ...avs,
      logo,
      name,
    };
  });
};

export const useAVSs = () => {
  const strategies = useStrategies();
  const protocolData = useProtocolData();

  return useQuery({
    enabled: Boolean(strategies.data) && Boolean(protocolData.data),
    queryKey: ['avss'],
    queryFn: async () => {
      if (!strategies.data || !protocolData.data) {
        return Promise.reject(new Error('AVSs request cannot be sent without strategies and protocol data.'));
      }

      const avss = await fetchAllParallel(protocolData.data.avsCount, (skip) =>
        fetchAVSs(`
          first: ${REQUEST_LIMIT},
          skip: ${skip},
          where: {paused: false}
        `),
      );

      return avss.map((avs) => transformToRow(avs, strategies.data.strategyToEthBalance));
    },
  });
};
