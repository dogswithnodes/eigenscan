export type StrategyServer = {
  id: string;
  name: string;
  totalShares: string;
  totalDelegated: string;
  totalWithdrawing: string;
  tokenSymbol: string;
  tokenDecimals: number;
  underlyingToken: string | null;
  stakesCount: number;
  delegationsCount: number;
  operatorsCount: number;
  whitelisted: boolean;
  withdrawals: Array<{
    share: string;
  }>;
};

export type Strategy = StrategyServer & {
  tvl: string;
  balance: string;
  logo?: string | null;
};
