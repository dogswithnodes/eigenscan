'use client';
import { titles } from '@/app/_components/actions-table/actions-table.model';
import { BaseAction, BaseActionsRow } from '@/app/_models/actions.model';
import { NullableFieldsRecord, RecordEntries } from '@/app/_utils/actions.utils';

type OperatorActionData = NullableFieldsRecord<{
  avs: {
    id: string;
  };
  delegationApprover: string;
  earningsReceiver: string;
  delegator: {
    id: string;
  };
  metadataURI: string;
  stakerOptOutWindowBlocks: string;
  status: number;
  quorum: {
    quorum: {
      quorum: number;
    } | null;
  };
}>;

export type OperatorAction = BaseAction & OperatorActionData;

type OperatorActionDataEntries = RecordEntries<OperatorActionData>;

export type OperatorActionsRow = BaseActionsRow & {
  actionDataEntries: OperatorActionDataEntries;
};

const transformToEntries = (data: OperatorActionData): OperatorActionDataEntries =>
  Object.entries(data).filter((entry): entry is OperatorActionDataEntries[number] => entry[0] in data);

export const transformToRow = ({
  id: key,
  blockNumber,
  blockTimestamp,
  transactionHash,
  type,
  ...rest
}: OperatorAction): OperatorActionsRow => {
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
}: OperatorActionsRow) => ({
  [titles.blockNumber]: blockNumber,
  [titles.blockTimestamp]: blockTimestamp,
  [titles.transactionHash]: transactionHash,
  [titles.typeId]: typeId,
});
