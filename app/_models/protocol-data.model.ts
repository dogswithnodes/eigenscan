export type ProtocolContracts = {
  delegationManager: string;
  strategyManager: string;
  eigenPodManager: string;
  avsDirectory: string;
  slasher: string;
};

export type ProtocolData = {
  id: string;
  operatorsCount: number;
  avsCount: number;
  stakersCount: number;
  stakersWhoDelegateCount: number;
  strategiesCount: number;
} & ProtocolContracts;
