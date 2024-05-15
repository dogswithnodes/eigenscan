import { BaseAction } from '@/app/_models/actions.model';

export type StakerStaker = {
  id: string;
  shares: string;
  createdTimestamp: string;
  lastUpdatedTimestamp: string;
  strategy: {
    id: string;
    totalShares: string;
  };
  withdrawal: {
    share: string;
  } | null;
};

export type OperatorAction = BaseAction;

export type StakerAction = BaseAction;
