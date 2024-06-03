import { titles } from '@/app/_components/actions-table/actions-table.model';
import { BaseAction, BaseActionsRow } from '@/app/_models/actions.model';
import { NullableFieldsRecord, RecordEntries } from '@/app/_utils/actions.utils';

type AVSActionData = NullableFieldsRecord<{
  metadataURI: string;
  minimumStake: string;
  minimalStake: string;
  quorumNumber: number;
  operator: {
    id: string;
  };
  multiplier: {
    multiply: string;
  };
  strategy: {
    id: string;
    name: string;
  };
}>;

export type AVSAction = BaseAction & AVSActionData;

type AVSActionDataEntries = RecordEntries<AVSActionData>;

export type AVSActionsRow = BaseActionsRow & {
  actionDataEntries: AVSActionDataEntries;
};

const transformToEntries = (data: AVSActionData): AVSActionDataEntries =>
  Object.entries(data).filter((entry): entry is AVSActionDataEntries[number] => entry[0] in data);

export const transformToRow = ({
  id: key,
  blockNumber,
  blockTimestamp,
  transactionHash,
  type,
  ...rest
}: AVSAction): AVSActionsRow => {
  return {
    key,
    blockNumber,
    blockTimestamp,
    transactionHash,
    typeId: type,
    actionDataEntries: transformToEntries({
      ...rest,
    }),
  };
};

export const transformToCsvRow = ({
  blockNumber,
  blockTimestamp,
  transactionHash,
  typeId,
}: AVSActionsRow) => ({
  [titles.blockNumber]: blockNumber,
  [titles.blockTimestamp]: blockTimestamp,
  [titles.transactionHash]: transactionHash,
  [titles.typeId]: typeId,
});
