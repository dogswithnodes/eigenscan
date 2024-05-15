import { BaseAction } from '@/app/_models/actions.model';

export type AVSOperator = {
  operator: {
    id: string;
    metadataURI: string | null;
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
  quorum: number;
  multipliers: Array<{
    multiply: string;
    strategy: {
      id: string;
    };
  }>;
  operators: Array<AVSOperator>;
  operatorsCount: number;
};

export type AVSAction = BaseAction & {
  quorumNumber: string | null;
};
