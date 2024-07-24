'use server';
import { gql } from 'graphql-request';

import { AVSAction, transformToRow } from './avs-actions.model';

import { REQUEST_LIMIT, fetchAllConsecutively, request } from '@/app/_services/graphql.service';

type AVSActionsResponse = {
  avsactions: Array<AVSAction>;
};

const fetchAVSActions = async (requestOptions: string): Promise<Array<AVSAction>> => {
  const { avsactions } = await request<AVSActionsResponse>(gql`
    query {
      avsactions(
        ${requestOptions}
      ) {
        id
        blockNumber
        blockTimestamp
        transactionHash
        type
        minimalStake
        minimumStake
        quorumNumber
        metadataURI
        operator {
          id
        }
        multiplier {
          multiply
        }
        strategy {
          id
          name
        }
      }
    }
  `);

  return avsactions;
};

export const fetchAllAVSActions = async (id: string) => {
  const actions = await fetchAllConsecutively((actionId) =>
    fetchAVSActions(`
      first: ${REQUEST_LIMIT}
      where: {avs: ${JSON.stringify(id)}, id_gt: ${JSON.stringify(actionId)}}
    `),
  );

  return actions.map(transformToRow);
};
