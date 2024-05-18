import { Strategy } from '@/app/_models/strategies.model';
import { fetchStrategiesWithTvl } from '@/app/_services/strategies.service';
export const runtime = 'edge';
export async function GET() {
  const strategies: Array<Strategy> = await fetchStrategiesWithTvl();

  try {
    const COIN_MARKET_CAP_API_KEY = process.env.COIN_MARKET_CAP_API_KEY;

    if (!COIN_MARKET_CAP_API_KEY) {
      throw 'COIN_MARKET_CAP_API_KEY is not defined';
    }

    const res = await fetch(
      `https://pro-api.coinmarketcap.com/v2/cryptocurrency/info?${new URLSearchParams({
        symbol: strategies.map(({ tokenSymbol }) => tokenSymbol).join(','),
        aux: 'logo',
        skip_invalid: 'true',
        CMC_PRO_API_KEY: COIN_MARKET_CAP_API_KEY,
      })}`,
    );

    const { data } = await res.json();

    if (data) {
      strategies.forEach((strategy) => {
        const { tokenSymbol } = strategy;
        strategy.logo = data[tokenSymbol.toUpperCase()].at(0)?.logo;
      });
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
  }

  return Response.json(strategies);
}
