import { BaseAction } from '@/app/_models/actions.model';

export type AVSOperator = {
  operator: {
    id: string;
    metadataURI: string | null;
    totalEigenShares: string;
    strategies: Array<{
      totalShares: string;
      strategy: {
        id: string;
        totalShares: string;
      };
    }>;
  };
};

export type Quorum = {
  minimalStake: string;
  quorum: number;
  multipliers: Array<{
    multiply: string;
    strategy: {
      id: string;
    };
  }>;
  operators: Array<
    AVSOperator & {
      totalWeight: string;
    }
  >;
  operatorsCount: number;
};

export type AVSAction = BaseAction & {
  quorumNumber: string | null;
};
