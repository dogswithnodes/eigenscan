import { AvsOperatorsRow } from './avs-operators.model';

export const renderQuorumShares = (value: number, row: AvsOperatorsRow) =>
  `${value.toFixed(2)} (${((value * 100) / row.quorumTotalShares).toFixed(2)}%)`;
