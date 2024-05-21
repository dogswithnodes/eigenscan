import BigNumber from 'bignumber.js';

export const toEth = (value: BigNumber.Value) => new BigNumber(value).div(1e18);

export const calculateTotalAssets = (shares: string, balance: string, totalShares: string) =>
  new BigNumber(shares).times(balance).div(totalShares);
