import { titles } from '@/app/_components/actions-table/actions-table.model';
import { BaseAction, BaseActionsRow } from '@/app/_models/actions.model';
import { NullableFieldsRecord, RecordEntries } from '@/app/_utils/actions.utils';

type StakerActionDataServer = NullableFieldsRecord<{
  delegatedTo: {
    id: string;
  };
  eigonPod: string;
  nonce: string;
  share: string;
  strategy: {
    id: string;
    name: string;
  };
  startBlock: string;
  token: string;
  withdrawer: string;
  withdrawal: {
    queuedBlockNumber: string;
    queuedTransactionHash: string;
    completedBlockNumber: string | null;
    completedTransactionHash: string | null;
    strategies: Array<{
      share: string;
      strategy: {
        tokenSymbol: string;
      };
    }>;
  } | null;
}>;

export type StakerAction = BaseAction & StakerActionDataServer;

type StakerActionData = Omit<StakerActionDataServer, 'withdrawal'> &
  NullableFieldsRecord<StakerActionDataServer['withdrawal']>;

type StakerActionDataEntries = RecordEntries<StakerActionData>;

export type StakerActionsRow = BaseActionsRow & {
  actionDataEntries: StakerActionDataEntries;
};

const transformToEntries = (data: StakerActionData): StakerActionDataEntries =>
  Object.entries(data).filter((entry): entry is StakerActionDataEntries[number] => entry[0] in data);

export const transformToRow = ({
  id: key,
  blockNumber,
  blockTimestamp,
  transactionHash,
  type,
  withdrawal,
  ...rest
}: StakerAction): StakerActionsRow => {
  return {
    key,
    blockNumber,
    blockTimestamp,
    transactionHash,
    typeId: type,
    actionDataEntries: transformToEntries({
      ...rest,
      // TODO fix
      queuedBlockNumber: withdrawal?.queuedBlockNumber ?? null,
      queuedTransactionHash: withdrawal?.queuedTransactionHash ?? null,
      completedBlockNumber: withdrawal?.completedBlockNumber ?? null,
      completedTransactionHash: withdrawal?.completedTransactionHash ?? null,
      strategies: withdrawal?.strategies ?? null,
    }),
  };
};

export const transformToCsvRow = ({
  blockNumber,
  blockTimestamp,
  transactionHash,
  typeId,
}: StakerActionsRow) => ({
  [titles.blockNumber]: blockNumber,
  [titles.blockTimestamp]: blockTimestamp,
  [titles.transactionHash]: transactionHash,
  [titles.typeId]: typeId,
});
