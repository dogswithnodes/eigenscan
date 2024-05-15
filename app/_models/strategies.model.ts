export type StrategyServer = {
  id: string;
  name: string;
  totalShares: string;
  totalDelegated: string;
  tokenSymbol: string;
  stakesCount: number;
  delegationsCount: number;
  underlyingToken: string | null;
};

export type Strategy = StrategyServer & {
  tvl: string;
  balance: string;
  logo?: string | null;
};
