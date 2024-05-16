import { useQuery } from '@tanstack/react-query';
import { gql } from 'graphql-request';

import { OperatorAction, StakerStaker, StakerAction } from './profile.model';

import { REQUEST_LIMIT, request } from '@/app/_services/graphql.service';
import { ProtocolEntityMetadata } from '@/app/_models/protocol-entity-metadata.model';

type AccountResponse = {
  eigenAccount: {
    id: string;
    operator: {
      id: string;
      registered: string;
      metadataURI: string | null;
      delegatorsCount: number;
      actions: Array<OperatorAction>;
      strategies: Array<{
        totalShares: string;
        strategy: {
          id: string;
          totalShares: string;
        };
      }>;
    } | null;
    staker: {
      id: string;
      stakesCount: number;
      withdrawalsCount: number;
      actions: Array<StakerAction>;
      stakes: Array<StakerStaker>;
      withdrawals: Array<{
        strategies: Array<{
          share: string;
          strategy: {
            id: string;
            totalShares: string;
          };
        }>;
      }>;
      delegator: {
        operator: {
          id: string;
        } | null;
      } | null;
    } | null;
  } | null;
};

export const useAccount = (id: string) => {
  return useQuery({
    queryKey: ['account', id],
    queryFn: async () => {
      const { eigenAccount } = await request<AccountResponse>(gql`
        query {
          eigenAccount(id: ${JSON.stringify(id)}) {
            id
            operator {
              id
              registered
              metadataURI
              delegatorsCount
              actions {
                id
                type
                blockNumber
                blockTimestamp
                transactionHash
              }
              strategies {
                strategy(
                  first: ${REQUEST_LIMIT}
                  where: {strategy_not: null, totalShares_gt: "0"}
                ) {
                  id
                  totalShares
                }
                totalShares
              }
            }
            staker {
              id
              actions {
                id
                type
                blockNumber
                blockTimestamp
                transactionHash
              }
              delegator {
                operator {
                  id
                }
              }
              stakes(
                first: ${REQUEST_LIMIT}
              ) {
                id
                createdTimestamp
                lastUpdatedTimestamp
                shares
                strategy {
                  id
                  totalShares
                }
                withdrawal {
                  share
                }
              }
              withdrawals(
                first: ${REQUEST_LIMIT}
              ) {
                strategies(
                  first:${REQUEST_LIMIT}
                  where: {strategy_not: null, share_not: null}
                ) {
                  share
                  strategy {
                    id
                    totalShares
                  }
                }
              }
              withdrawalsCount
              stakesCount
            }
          }
        }
      `);

      if (!eigenAccount) return null;

      const { operator, staker } = eigenAccount;

      if (!operator && !staker) return null;

      const metadataRes =
        operator && operator.metadataURI
          ? await fetch(
              `${process.env.NEXT_PUBLIC_URL}/api/metadata?${new URLSearchParams({
                uri: operator.metadataURI,
              })}`,
            )
          : null;

      const metadata: ProtocolEntityMetadata | null = metadataRes ? await metadataRes.json() : null;

      return {
        ...metadata,
        operator,
        staker,
        isOperator: Boolean(operator),
        isStaker: Boolean(staker),
      };
    },
  });
};
