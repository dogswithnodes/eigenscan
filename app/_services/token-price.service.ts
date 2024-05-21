'use server';
import BigNumber from 'bignumber.js';

export const fetchTokenPrice = async (symbol: string) => {
  const COIN_MARKET_CAP_API_KEY = process.env.COIN_MARKET_CAP_API_KEY;

  if (!COIN_MARKET_CAP_API_KEY) throw 'COIN_MARKEY_CAP_API_KEY is not defined';

  const res = await fetch(
    `https://pro-api.coinmarketcap.com/v2/tools/price-conversion?${new URLSearchParams({
      amount: '1',
      convert: 'ETH',
      symbol,
      CMC_PRO_API_KEY: COIN_MARKET_CAP_API_KEY,
    })}`,
  );

  if (!res.ok) {
    return '0';
  }

  const { data } = await res.json();

  return data ? new BigNumber(data[0].quote.ETH.price).times(1e18).toString() : '0';
};
