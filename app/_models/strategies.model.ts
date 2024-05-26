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
  ethBalance: string;
  balance: string;
  totalSharesAndWithdrawing: string;
};

export type StrategyEnriched = Strategy & {
  logo: string | null;
};

export type StrategyToEthBalance = Record<string, string>;
