'use server';
import { StrategyServer } from '../_models/strategies.model';

export const fetchTokensMetadata = async (
  strategies: Array<Pick<StrategyServer, 'tokenSymbol'>>,
): Promise<Record<string, Array<{ logo?: string }>>> => {
  const COIN_MARKET_CAP_API_KEY = process.env.COIN_MARKET_CAP_API_KEY;

  if (!COIN_MARKET_CAP_API_KEY) throw 'COIN_MARKET_CAP_API_KEY is not defined';

  const res = await fetch(
    `https://pro-api.coinmarketcap.com/v2/cryptocurrency/info?${new URLSearchParams({
      symbol: strategies.map(({ tokenSymbol }) => tokenSymbol).join(','),
      aux: 'logo',
      skip_invalid: 'true',
      CMC_PRO_API_KEY: COIN_MARKET_CAP_API_KEY,
    })}`,
  );

  if (!res.ok) return {};
  // @ts-expect-error TODO: fix this
  const { data } = await res.json();

  if (data && typeof data === 'object') {
    return data;
  }

  return {};
};
