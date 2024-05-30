import { useQuery } from '@tanstack/react-query';
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

export const useAVSActions = (avsId: string) => {
  return useQuery({
    queryKey: ['avs-actions', avsId],
    queryFn: async () => {
      const actions = await fetchAllConsecutively((skip) =>
        fetchAVSActions(`
          first: ${REQUEST_LIMIT}
          skip:${skip}
          where: {avs: ${JSON.stringify(avsId)}}
        `),
      );

      return actions.map(transformToRow);
    },
  });
};
