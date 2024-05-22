import { BaseAction } from '@/app/_models/actions.model';
import { FetchParams } from '@/app/_models/table.model';

export type ProfileTabTableFetchParams<Row> = FetchParams<Row> & { id: string };

export type StakerStake = {
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
