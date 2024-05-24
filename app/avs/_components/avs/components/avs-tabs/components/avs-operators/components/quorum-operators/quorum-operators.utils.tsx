import { QuorumOperatorsRow } from './quorum-operators.model';

import { renderBigNumber } from '@/app/_utils/render.utils';
import { mulDiv } from '@/app/_utils/big-number.utils';

export const renderTotalWeight = (value: string, row: QuorumOperatorsRow) => (
  <>
    {renderBigNumber(value)} ({mulDiv(value, 100, row.quorumWeight).toFixed(2)}%)
  </>
);
