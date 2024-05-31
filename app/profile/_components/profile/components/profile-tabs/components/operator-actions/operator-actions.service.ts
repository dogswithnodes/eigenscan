import { useQuery } from '@tanstack/react-query';
import { gql } from 'graphql-request';

import { fetchAllOperatorActions } from './operator-actions.action';
import { OperatorAction, OperatorActionsFetchParams } from './operator-actions.model';

import { request } from '@/app/_services/graphql.service';

type OperatorActionsResponse = {
  operatorActions: Array<OperatorAction>;
};

export const fetchOperatorActions = async (requestOptions: string): Promise<Array<OperatorAction>> => {
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

export const useOperatorActions = (params: OperatorActionsFetchParams) => {
  const { id, currentPage, perPage, sortParams } = params;

  return useQuery({
    queryKey: ['operator-actions', id, currentPage, perPage, sortParams],
    queryFn: async () => {
      const data = await fetchAllOperatorActions(JSON.stringify(['operator-actions', id]), params);

      return data;
    },
    placeholderData: (prev) => prev,
  });
};
