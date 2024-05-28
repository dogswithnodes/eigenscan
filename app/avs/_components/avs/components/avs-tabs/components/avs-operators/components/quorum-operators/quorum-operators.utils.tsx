import { QuorumOperatorsRow } from './quorum-operators.model';

import { mulDiv } from '@/app/_utils/big-number.utils';
import { renderBigNumber } from '@/app/_utils/render.utils';

export const renderTotalWeight = (value: string, row: QuorumOperatorsRow) => (
  <>
    {renderBigNumber(value)} ({mulDiv(value, 100, row.quorumWeight).toFixed(2)}%)
  </>
);
