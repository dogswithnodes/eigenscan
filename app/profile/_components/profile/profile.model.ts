import { FetchParams } from '@/app/_models/table.model';

export type ProfileFetchParams<Row> = FetchParams<Row> & { id: string };

export type StakerStake = {
  id: string;
  shares: string;
  createdTimestamp: string;
  lastUpdatedTimestamp: string;
  strategy: {
    id: string;
  };
  withdrawal: {
    share: string;
  } | null;
};
