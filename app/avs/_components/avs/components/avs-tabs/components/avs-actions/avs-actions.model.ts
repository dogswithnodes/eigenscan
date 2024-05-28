'use client';
import { titles } from '@/app/_components/actions-table/actions-table.model';
import { BaseAction, BaseActionsRow } from '@/app/_models/actions.model';
import { NullableFieldsRecord, RecordEntries } from '@/app/_utils/actions.utils';

type AVSActionData = {
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
};

export type AVSAction = BaseAction & NullableFieldsRecord<AVSActionData>;

type AVSActionDataEntries = RecordEntries<AVSActionData>;

export type AVSActionsRow = BaseActionsRow & {
  actionDataEntries: AVSActionDataEntries;
};

const transformToEntries = (data: NullableFieldsRecord<AVSActionData>) =>
  Object.entries(data).filter((entry): entry is AVSActionDataEntries[number] => entry.at(1) !== null);

export const transformToRow = ({
  id: key,
  blockNumber,
  blockTimestamp,
  transactionHash,
  type,
  metadataURI,
  minimalStake,
  minimumStake,
  quorumNumber,
  operator,
  multiplier,
  strategy,
}: AVSAction): AVSActionsRow => {
  return {
    key,
    blockNumber,
    blockTimestamp,
    transactionHash,
    type,
    actionDataEntries: transformToEntries({
      metadataURI,
      minimalStake,
      minimumStake,
      quorumNumber,
      operator,
      multiplier,
      strategy,
    }),
  };
};

export const transformToCsvRow = ({ blockNumber, blockTimestamp, transactionHash, type }: AVSActionsRow) => ({
  [titles.blockNumber]: blockNumber,
  [titles.blockTimestamp]: blockTimestamp,
  [titles.transactionHash]: transactionHash,
  [titles.type]: type,
});
