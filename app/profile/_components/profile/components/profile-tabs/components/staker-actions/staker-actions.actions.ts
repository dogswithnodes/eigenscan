'use server';
import { gql } from 'graphql-request';

import { StakerAction, transformToRow } from './staker-actions.model';

import { REQUEST_LIMIT, fetchAllConsecutively, request } from '@/app/_services/graphql.service';

type StakerActionsResponse = {
  stakerActions: Array<StakerAction>;
};

const fetchStakerActions = async (requestOptions: string): Promise<Array<StakerAction>> => {
  const { stakerActions } = await request<StakerActionsResponse>(gql`
    query {
      stakerActions(
        ${requestOptions}
      ) {
        id
        blockNumber
        blockTimestamp
        transactionHash
        type
        delegatedTo {
          id
        }
        eigonPod
        nonce
        share
        strategy {
          id
          name
        }
        startBlock
        token
        withdrawer
        withdrawal {
          queuedBlockNumber
          queuedTransactionHash
          completedBlockNumber
          completedTransactionHash
          strategies(
            first: ${REQUEST_LIMIT}
            where: {share_gt: "0", strategy_not: null}
          ) {
            share
            strategy {
              tokenSymbol
            }
          }
        }
      }
    }
  `);

  return stakerActions;
};

export const fetchAllStakerActions = async (id: string) => {
  const actions = await fetchAllConsecutively((skip) =>
    fetchStakerActions(`
      first: ${REQUEST_LIMIT}
      skip:${skip}
      where: {staker: ${JSON.stringify(id)}}
    `),
  );

  return actions.map(transformToRow);
};
