import { Strategy } from '../_models/strategies.model';

export type StrategyToTvlMap = Record<string, string>;

export const createStrategyToTvlMap = (strategies: Array<Strategy>) =>
  strategies.reduce<StrategyToTvlMap>((map, { id, tvl }) => {
    map[id] = tvl;
    return map;
  }, {});
