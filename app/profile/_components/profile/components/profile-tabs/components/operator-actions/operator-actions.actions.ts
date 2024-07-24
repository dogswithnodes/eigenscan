'use server';
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

export const fetchAllOperatorActions = async (id: string) => {
  const actions = await fetchAllConsecutively((actionId) =>
    fetchOperatorActions(`
      first: ${REQUEST_LIMIT}
      where: {operator: ${JSON.stringify(id)}, id_gt: ${JSON.stringify(actionId)}}
    `),
  );

  return actions.map(transformToRow);
};
