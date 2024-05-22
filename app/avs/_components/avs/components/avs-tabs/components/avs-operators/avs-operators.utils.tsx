import type BigNumber from 'bignumber.js';

import { AvsOperatorsRow } from './avs-operators.model';

import { renderBigNumber } from '@/app/_utils/render.utils';
import { mulDiv } from '@/app/_utils/big-number.utils';

export const renderQuorumShares = (value: BigNumber, row: AvsOperatorsRow) => (
  <>
    {renderBigNumber(value)} ({mulDiv(value, 100, row.quorumTotalShares).toFixed(2)}%)
  </>
);
