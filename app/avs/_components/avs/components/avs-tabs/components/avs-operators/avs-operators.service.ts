import { useQuery } from '@tanstack/react-query';

import { OperatorsQuorumWeights } from '../../avs-tabs.model';
import { AVSOperator } from '../../../../avs.model';

import { StrategyToTvlMap } from '@/app/_utils/strategies.utils';

export const useAVSOperators = (
  operators: Array<AVSOperator>,
  weights: OperatorsQuorumWeights | null,
  strategyToTvl: StrategyToTvlMap,
) => {
  return useQuery({
    queryKey: ['avs-operators', JSON.stringify(operators)],
    queryFn: async () => {
      // TODO generic batch
      const metadata = await Promise.all(
        operators.map(({ operator: { metadataURI } }) =>
          metadataURI
            ? fetch(
                `${process.env.NEXT_PUBLIC_URL}/api/metadata?${new URLSearchParams({
                  uri: metadataURI,
                })}`,
              ).then((res) => res.json())
            : null,
        ),
      );

      return operators.map(({ operator: { id, strategies } }, i) => {
        const tvl = strategies.reduce((tvl, { totalShares, strategy }) => {
          tvl += (BigInt(totalShares) * BigInt(strategyToTvl[strategy.id])) / BigInt(strategy.totalShares);
          return tvl;
        }, BigInt(0));

        return {
          id,
          key: id,
          logo: metadata[i]?.logo ?? null,
          name: metadata[i]?.name ?? '',
          tvl: Number(tvl) / 1e18,
          quorumShares: weights ? weights[id] / 1e18 : 0,
          quorumTotalShares: weights ? weights.totalWeight / 1e18 : 0,
        };
      });
    },
  });
};
