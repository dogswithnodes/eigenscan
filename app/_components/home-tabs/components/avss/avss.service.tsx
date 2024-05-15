import { gql } from 'graphql-request';
import { useQuery } from '@tanstack/react-query';

import { EIGEN_STRATEGY } from '@/app/_constants/addresses.constants';
import { fetchEntitiesMetadata } from '@/app/_services/entity-metadata.service';
import { fetchAllParallel, request, REQUEST_LIMIT } from '@/app/_services/graphql.service';
import { fetchProtocolData } from '@/app/_services/protocol-data.service';
import { fetchStrategiesWithTvl } from '@/app/_services/strategies.service';
import { createStrategyToTvlMap } from '@/app/_utils/strategies.utils';

export const useAVSs = () => {
  return useQuery({
    queryKey: ['avss'],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/avss`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return res.json();
    },
  });
};

type AVSOperator = {
  operator: {
    strategies: Array<{
      totalShares: string;
      strategy: {
        id: string;
        totalShares: string;
      };
    }>;
  };
};

type AVSsResponse = {
  avss: Array<{
    id: string;
    metadataURI: string | null;
    created: string;
    registrationsCount: number;
    quorums: Array<{
      multipliers: Array<{
        strategy: {
          id: string;
        };
      }>;
      operators: Array<AVSOperator>;
      operatorsCount: number;
    }>;
    registrations: Array<AVSOperator>;
  }>;
};

const createAVSsFetcher = () => async (skip: number) => {
  const { avss } = await request<AVSsResponse>(
    gql`
      query {
        avss(
          first: ${REQUEST_LIMIT},
          skip: ${skip}
          where: {paused: false}
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

  const metadata = await fetchEntitiesMetadata(avss);

  return avss.map((avs) => {
    return {
      ...avs,
      metadata: metadata[avs.id],
    };
  });
};

type AVSTVLs = {
  ethTvl: string;
  eigenTvl: string;
};

export type AVS = {
  created: string;
  id: string;
  logo: string;
  name: string;
  registrationsCount: number;
} & AVSTVLs;

export const fetchAvss = async (): Promise<Array<AVS>> => {
  const { avsCount } = await fetchProtocolData();

  const [avss, strategies] = await Promise.all([
    fetchAllParallel(avsCount, createAVSsFetcher()),
    fetchStrategiesWithTvl(),
  ]);

  const strategyToTvl = createStrategyToTvlMap(strategies);

  return avss.map(({ id, metadata, created, quorums, registrations, registrationsCount }) => {
    const tvls = {
      ethTvl: BigInt(0),
      eigenTvl: BigInt(0),
    };

    if (quorums.length > 0 && quorums.some(({ operatorsCount }) => operatorsCount > 0)) {
      quorums.forEach(({ multipliers, operators }) => {
        const ethStrategies = multipliers.flatMap(({ strategy }) =>
          strategy.id !== EIGEN_STRATEGY ? strategy.id : [],
        );
        const eigenStrategies = multipliers.flatMap(({ strategy }) =>
          strategy.id === EIGEN_STRATEGY ? strategy.id : [],
        );

        operators.forEach((operator) => {
          operator.operator.strategies.forEach(({ totalShares, strategy }) => {
            if (ethStrategies.some((id) => id === strategy.id)) {
              tvls.ethTvl +=
                (BigInt(totalShares) * BigInt(strategyToTvl[strategy.id])) / BigInt(strategy.totalShares);
            } else if (eigenStrategies.some((id) => id === strategy.id)) {
              tvls.eigenTvl +=
                (BigInt(totalShares) * BigInt(strategyToTvl[strategy.id])) / BigInt(strategy.totalShares);
            }
          });
        });
      });
    } else {
      tvls.ethTvl = registrations.reduce((tvl, { operator }) => {
        tvl += operator.strategies.reduce((operatorTvl, { totalShares, strategy }) => {
          operatorTvl +=
            (BigInt(totalShares) * BigInt(strategyToTvl[strategy.id])) / BigInt(strategy.totalShares);

          return operatorTvl;
        }, BigInt(0));

        return tvl;
      }, BigInt(0));
    }

    return {
      id,
      logo: metadata.logo,
      name: metadata.name,
      created,
      registrationsCount,
      ethTvl: String(tvls.ethTvl),
      eigenTvl: String(tvls.eigenTvl),
    };
  });
};
