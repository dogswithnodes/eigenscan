import { AVSOperator, Quorum } from './avs.model';

import { EIGEN_STRATEGY } from '@/app/_constants/addresses.constants';
import { StrategyToTvlMap } from '@/app/_utils/strategies.utils';

export const calculateAVSTVLS = (
  quorums: Array<Quorum>,
  registrations: Array<AVSOperator>,
  strategyToTvl: StrategyToTvlMap,
) => {
  const tvls = {
    ethTvl: BigInt(0),
    eigenTvl: BigInt(0),
  };

  if (quorums.length > 0 && quorums.some(({ operatorsCount }) => operatorsCount > 0)) {
    quorums.forEach(({ multipliers, operators }) => {
      const ethStrategies = multipliers.flatMap(({ strategy }) =>
        strategy.id !== EIGEN_STRATEGY ? strategy.id : [],
      );
      const eigenStrategies = multipliers.flatMap(({ strategy }) =>
        strategy.id === EIGEN_STRATEGY ? strategy.id : [],
      );

      operators.forEach((operator) => {
        operator.operator.strategies.forEach(({ totalShares, strategy }) => {
          if (ethStrategies.some((id) => id === strategy.id)) {
            tvls.ethTvl +=
              (BigInt(totalShares) * BigInt(strategyToTvl[strategy.id])) / BigInt(strategy.totalShares);
          } else if (eigenStrategies.some((id) => id === strategy.id)) {
            tvls.eigenTvl +=
              (BigInt(totalShares) * BigInt(strategyToTvl[strategy.id])) / BigInt(strategy.totalShares);
          }
        });
      });
    });
  } else {
    tvls.ethTvl = registrations.reduce((tvl, { operator }) => {
      tvl += operator.strategies.reduce((operatorTvl, { totalShares, strategy }) => {
        operatorTvl +=
          (BigInt(totalShares) * BigInt(strategyToTvl[strategy.id])) / BigInt(strategy.totalShares);

        return operatorTvl;
      }, BigInt(0));

      return tvl;
    }, BigInt(0));
  }

  return {
    ethTvl: Number(tvls.ethTvl / BigInt(1e18)),
    eigenTvl: Number(tvls.eigenTvl / BigInt(1e18)),
  };
};
