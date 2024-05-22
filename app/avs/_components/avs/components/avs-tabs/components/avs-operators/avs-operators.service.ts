import { useQuery } from '@tanstack/react-query';
import BigNumber from 'bignumber.js';

import { OperatorsQuorumWeights } from '../../avs-tabs.model';
import { AVSOperator } from '../../../../avs.model';

import { BN_ZERO } from '@/app/_constants/big-number.constants';
import { StrategyToEthBalance } from '@/app/_models/strategies.model';
import { mulDiv } from '@/app/_utils/big-number.utils';
import { fetchProtocolEntitiesMetadata } from '@/app/_services/protocol-entity-metadata';

export const useAVSOperators = (
  operators: Array<AVSOperator>,
  weights: OperatorsQuorumWeights | null,
  strategyToEthBalance: StrategyToEthBalance,
) => {
  return useQuery({
    queryKey: ['avs-operators', JSON.stringify(operators)],
    queryFn: async () => {
      const metadata = await fetchProtocolEntitiesMetadata(
        operators.map(({ operator: { metadataURI } }) => metadataURI),
      );

      return operators.map(({ operator: { id, strategies } }, i) => {
        const tvl = strategies.reduce((tvl, { totalShares, strategy }) => {
          tvl = tvl.plus(mulDiv(totalShares, strategyToEthBalance[strategy.id], strategy.totalShares));

          return tvl;
        }, BN_ZERO);

        const { logo, name } = metadata[i];

        return {
          id,
          key: id,
          logo,
          name,
          tvl,
          quorumShares: weights ? new BigNumber(weights[id]) : BN_ZERO,
          quorumTotalShares: weights ? weights.totalWeight : '0',
        };
      });
    },
  });
};
