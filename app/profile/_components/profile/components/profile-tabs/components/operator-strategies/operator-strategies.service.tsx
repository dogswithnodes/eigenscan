import { useQuery } from '@tanstack/react-query';
import { gql } from 'graphql-request';

import { OperatorStrategy, transformToRow } from './operator-strategies.model';

import { StrategiesMapEnriched } from '@/app/_models/strategies.model';
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
            where: {strategy_not: null, totalShares_gt: "0"}
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

export const useOperatorStrategies = (id: string, strategies: StrategiesMapEnriched) => {
  return useQuery({
    queryKey: ['operator-strategies'],
    queryFn: async () => {
      const operatorStrategies = await fetchOperatorStrategies(id);

      return operatorStrategies.map((strategy) => transformToRow(strategy, strategies));
    },
  });
};
