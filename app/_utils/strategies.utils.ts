import { StrategyEnriched } from '../_models/strategies.model';

export type StrategyToTvlMap = Record<string, string>;

export const createStrategyToTvlMap = (strategies: Array<StrategyEnriched>) =>
  strategies.reduce<StrategyToTvlMap>((map, { id, tvl }) => {
    map[id] = tvl;
    return map;
  }, {});
