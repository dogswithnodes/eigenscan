import { gql } from 'graphql-request';
import { ethers } from 'ethers';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { request, REQUEST_LIMIT } from './graphql.service';

import erc20Abi from '../_models/erc20.model.json';
import offchainOracleAbi from '../_models/offchain-oracle.model.json';
import { Strategy, StrategyEnriched } from '../_models/strategies.model';

type StrategiesResponse = {
  strategies: Array<Strategy>;
};

const OFFCHAIN_ORACLE = '0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8';

export const fetchStrategiesWithTvl = async (): Promise<Array<StrategyEnriched>> => {
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
        tokenSymbol
        stakesCount
        delegationsCount
        underlyingToken
      }
    }
  `);

  const ETH_NODE = process.env.ETH_NODE;

  if (!ETH_NODE) {
    throw 'ETH_NODE is not defined';
  }

  const provider = new ethers.JsonRpcProvider(ETH_NODE);

  const offchainOracle = new ethers.Contract(OFFCHAIN_ORACLE, offchainOracleAbi, provider);

  const [prices, balances] = await Promise.all([
    await Promise.all(
      strategies.map(async ({ underlyingToken, tokenSymbol }) => {
        if (underlyingToken) {
          const value = (await offchainOracle.getRateToEth(underlyingToken, false)).toString();

          if (value === '0') {
            const COIN_MARKET_CAP_API_KEY = process.env.COIN_MARKET_CAP_API_KEY;

            if (!COIN_MARKET_CAP_API_KEY) {
              throw 'COIN_MARKET_CAP_API_KEY is not defined';
            }

            const res = await fetch(
              `https://pro-api.coinmarketcap.com/v2/tools/price-conversion?${new URLSearchParams({
                amount: '1',
                convert: 'ETH',
                symbol: tokenSymbol,
                CMC_PRO_API_KEY: COIN_MARKET_CAP_API_KEY,
                skip_invalid: 'true',
              })}`,
            );

            const { data } = await res.json();

            return data ? `${data[0].quote.ETH.price * 1e18}` : '0';
          }

          return value;
        }

        return `${1e18}`;
      }),
    ),
    await Promise.all(
      strategies.map(async ({ id, underlyingToken, totalShares }) => {
        if (underlyingToken) {
          const token = new ethers.Contract(underlyingToken, erc20Abi, provider);

          return String(await token.balanceOf(id));
        }

        return totalShares;
      }),
    ),
  ]);

  return strategies.map((strategy, i) => {
    return {
      ...strategy,
      tvl: String((BigInt(balances[i]) * BigInt(prices[i])) / BigInt(1e18)),
    };
  });
};

export const useStrategies = (
  options?: Omit<UseQueryOptions<Array<StrategyEnriched>>, 'queryKey' | 'queryFn'>,
) => {
  return useQuery({
    queryKey: ['strategies'],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/strategies`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return await res.json();
    },
    ...options,
  });
};
