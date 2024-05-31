import { useQuery } from '@tanstack/react-query';
import { gql } from 'graphql-request';

import { StakerStake } from './profile.model';

import { DEFAULT_METADATA_MAP_KEY } from '@/app/_constants/protocol-entity-metadata.constants';
import { REQUEST_LIMIT, request } from '@/app/_services/graphql.service';
import { fetchProtocolEntitiesMetadata } from '@/app/_services/protocol-entity-metadata.service';

type AccountResponse = {
  eigenAccount: {
    id: string;
    operator: {
      id: string;
      actionsCount: number;
      registered: string;
      metadataURI: string | null;
      delegatorsCount: number;
      strategies: Array<{
        totalShares: string;
        strategy: {
          id: string;
        };
      }>;
    } | null;
    staker: {
      id: string;
      actionsCount: number;
      stakesCount: number;
      withdrawalsCount: number;
      totalEigenShares: string;
      totalEigenWithdrawalsShares: string;
      // TODO server
      stakes: Array<StakerStake>;
      withdrawals: Array<{
        strategies: Array<{
          share: string;
          strategy: {
            id: string;
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
              actionsCount
              registered
              metadataURI
              delegatorsCount
              strategies(
                  first: ${REQUEST_LIMIT}
                  where: {strategy_not: null, totalShares_gt: "0"}
                ) {
                strategy {
                  id
                }
                totalShares
              }
            }
            staker {
              id
              actionsCount
              totalEigenWithdrawalsShares
              totalEigenShares
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

      const metadata = operator
        ? (await fetchProtocolEntitiesMetadata([operator.metadataURI]))[
            operator.metadataURI ?? DEFAULT_METADATA_MAP_KEY
          ]
        : null;

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
