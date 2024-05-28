export type BaseAction = {
  id: string;
  blockNumber: string;
  blockTimestamp: string;
  type: string;
  transactionHash: string;
};

export type BaseActionsRow = Omit<BaseAction, 'id' | 'type'> & {
  key: string;
  typeId: string;
};
