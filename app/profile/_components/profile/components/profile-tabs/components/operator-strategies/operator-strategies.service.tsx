import { gql } from 'graphql-request';
import { useQuery } from '@tanstack/react-query';

import { OperatorStrategy, transformToRow } from './operator-strategies.model';

import { StrategyEnriched } from '@/app/_models/strategies.model';
import { request, REQUEST_LIMIT } from '@/app/_services/graphql.service';

type OperatorAVSsResponse = {
  operator: {
    strategies: Array<OperatorStrategy>;
  };
};

const fetchOperatorStrategies = async (id: string): Promise<Array<OperatorStrategy>> => {
  const { operator } = await request<OperatorAVSsResponse>(
    gql`
      query {
        operator(
          id: ${JSON.stringify(id)}
        ) {
          strategies(
            first: ${REQUEST_LIMIT}
          ) {
            id
            totalShares
            strategy {
              id
            }
          }
        }
      }
    `,
  );

  return operator.strategies;
};

export const useOperatorStrategies = (id: string, strategies: Array<StrategyEnriched>) => {
  return useQuery({
    queryKey: ['operator-strategies'],
    queryFn: async () => {
      const operatorStrategies = await fetchOperatorStrategies(id);

      return operatorStrategies.map((strategy) => transformToRow(strategy, strategies));
    },
  });
};
