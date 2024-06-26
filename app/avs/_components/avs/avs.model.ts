export type AVSOperator = {
  operator: {
    id: string;
    totalEigenShares: string;
    strategies: Array<{
      totalShares: string;
      strategy: {
        id: string;
      };
    }>;
  };
};

export type Multiplier = {
  id: string;
  multiply: string;
  strategy: {
    id: string;
  };
};

export type Quorum = {
  minimalStake: string;
  quorum: number;
  multipliers: Array<Multiplier>;
  operators: Array<
    AVSOperator & {
      totalWeight: string;
    }
  >;
  operatorsCount: number;
};
