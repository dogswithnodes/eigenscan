import { QuorumWeights } from '../../avs-tabs.model';

import { divBy1e18 } from '@/app/_utils/big-number.utils';

export const transformWeightsToChartData = (weights: QuorumWeights | null) =>
  weights
    ? Object.entries(weights)
        .flatMap(([id, weight]) =>
          id === 'totalWeight' ? [] : { name: id, value: Number(divBy1e18(weight).toFixed(2)) },
        )
        .sort((a, b) => b.value - a.value)
    : null;
