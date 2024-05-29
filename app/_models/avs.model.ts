export type AVSOperatorBase = {
  operator: {
    totalEigenShares: string;
    strategies: Array<{
      totalShares: string;
      strategy: {
        id: string;
      };
    }>;
  };
};

export type QuorumBase = {
  multipliers: Array<{
    strategy: {
      id: string;
    };
  }>;
  operators: Array<AVSOperatorBase>;
  operatorsCount: number;
};
