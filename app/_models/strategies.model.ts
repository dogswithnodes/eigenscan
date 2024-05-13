export type Strategy = {
  id: string;
  name: string;
  totalShares: string;
  totalDelegated: string;
  tokenSymbol: string;
  stakesCount: number;
  delegationsCount: number;
  underlyingToken: string | null;
};

export type StrategyEnriched = Strategy & {
  tvl: string;
  logo?: string | null;
};
