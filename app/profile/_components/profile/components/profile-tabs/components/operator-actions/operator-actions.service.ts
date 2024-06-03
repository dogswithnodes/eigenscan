import { useQuery } from '@tanstack/react-query';
import { gql } from 'graphql-request';

import { OperatorAction, transformToRow } from './operator-actions.model';

import { REQUEST_LIMIT, fetchAllConsecutively, request } from '@/app/_services/graphql.service';

type OperatorActionsResponse = {
  operatorActions: Array<OperatorAction>;
};

const fetchOperatorActions = async (requestOptions: string): Promise<Array<OperatorAction>> => {
  const { operatorActions } = await request<OperatorActionsResponse>(gql`
    query {
      operatorActions(
        ${requestOptions}
      ) {
        id
        blockNumber
        blockTimestamp
        transactionHash
        type
        avs {
          id
        }
        delegationApprover
        earningsReceiver
        delegator {
          id
        }
        metadataURI
        stakerOptOutWindowBlocks
        status
        quorum {
          quorum {
            quorum
          }
        }
      }
    }
  `);

  return operatorActions;
};

export const useOperatorActions = (id: string) => {
  return useQuery({
    queryKey: ['operator-actions', id],
    queryFn: async () => {
      const actions = await fetchAllConsecutively((skip) =>
        fetchOperatorActions(`
          first: ${REQUEST_LIMIT}
          skip:${skip}
          where: {operator: ${JSON.stringify(id)}}
        `),
      );

      return actions.map(transformToRow);
    },
  });
};
