import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import { gql } from 'graphql-request';

import { request, REQUEST_LIMIT } from './graphql.service';
import { fetchTokenPrice } from './token-price.service';
import { fetchTokensMetadata } from './tokens-metadata.service';

import erc20Abi from '../_models/erc20.model.json';
import offchainOracleAbi from '../_models/offchain-oracle.model.json';
import {
  StrategyServer,
  Strategy,
  StrategyEnriched,
  StrategiesMap,
  StrategiesMapEnriched,
} from '../_models/strategies.model';
import { add } from '../_utils/big-number.utils';

type StrategiesResponse = {
  strategies: Array<StrategyServer>;
};

const OFFCHAIN_ORACLE = '0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8';

export const useStrategies = (
  options?: Omit<
    UseQueryOptions<{
      strategies: Array<Strategy>;
      strategiesMap: StrategiesMap;
    }>,
    'queryKey' | 'queryFn'
  >,
) => {
  return useQuery({
    queryKey: ['strategies'],
    queryFn: async () => {
      const { strategies } = await request<StrategiesResponse>(gql`
        query {
          strategies(
            first: ${REQUEST_LIMIT}
            where: {totalShares_gt: "0"}
          ) {
            id
            name
            totalShares
            totalDelegated
            totalWithdrawing
            tokenSymbol
            stakesCount
            delegationsCount
            underlyingToken
            whitelisted
            tokenDecimals
            operatorsCount
            withdrawals(
              first: ${REQUEST_LIMIT}
              where: {share_not: null, strategy_not: null}
            ) {
              share
            }
          }
        }
      `);

      const NEXT_PUBLIC_ETH_NODE = process.env.NEXT_PUBLIC_ETH_NODE;

      if (!NEXT_PUBLIC_ETH_NODE) throw 'NEXT_PUBLIC_ETH_NODE is not defined';

      const provider = new ethers.JsonRpcProvider(NEXT_PUBLIC_ETH_NODE);

      const offchainOracle = new ethers.Contract(OFFCHAIN_ORACLE, offchainOracleAbi, provider);

      const [prices, balances] = await Promise.all([
        Promise.all(
          strategies.map(async ({ underlyingToken, tokenSymbol }) => {
            if (!underlyingToken) return `${1e18}`;

            const price = String(await offchainOracle.getRateToEth(underlyingToken, false));

            if (price === '0') {
              return await fetchTokenPrice(tokenSymbol);
            }

            return price;
          }),
        ),
        Promise.all(
          strategies.map(async ({ id, underlyingToken, totalShares, totalWithdrawing }) => {
            if (underlyingToken) {
              const token = new ethers.Contract(underlyingToken, erc20Abi, provider);

              return String(await token.balanceOf(id));
            }

            return add(totalShares, totalWithdrawing).toFixed();
          }),
        ),
      ]);

      const strategiesWithBalances = strategies.map((strategy, i) => {
        const balance = balances[i];
        return {
          ...strategy,
          balance,
          ethBalance: new BigNumber(balance).times(prices[i]).div(1e18).decimalPlaces(0, 1).toFixed(),
          totalSharesAndWithdrawing: add(strategy.totalShares, strategy.totalWithdrawing).toFixed(),
        };
      });

      return {
        strategies: strategiesWithBalances,
        strategiesMap: strategiesWithBalances.reduce<StrategiesMap>((acc, strategy) => {
          acc[strategy.id] = strategy;
          return acc;
        }, {}),
      };
    },
    ...options,
  });
};

type UseEnrichedStrategiesData = {
  strategies: Array<StrategyEnriched>;
  strategiesMap: StrategiesMapEnriched;
};

export const useEnrichedStrategies = (
  options?: Omit<UseQueryOptions<UseEnrichedStrategiesData>, 'queryKey' | 'queryFn'>,
) => {
  const { data } = useStrategies();

  return useQuery({
    queryKey: ['enriched-strategies'],
    queryFn: async () => {
      if (!data) {
        if (!data) {
          return Promise.reject(new Error('enriched-strategies: Insufficient data'));
        }
      }

      const { strategies } = data;

      const tokensMetadata = await fetchTokensMetadata(strategies);

      return strategies.reduce<UseEnrichedStrategiesData>(
        (acc, strategy) => {
          const enrichedStrategy = {
            ...strategy,
            logo: tokensMetadata[strategy.tokenSymbol.toUpperCase()].at(0)?.logo || null,
          };
          acc.strategies.push(enrichedStrategy);
          acc.strategiesMap[enrichedStrategy.id] = enrichedStrategy;

          return acc;
        },
        {
          strategies: [],
          strategiesMap: {},
        },
      );
    },
    ...options,
    enabled: Boolean(data) && (options?.enabled ?? true),
  });
};
