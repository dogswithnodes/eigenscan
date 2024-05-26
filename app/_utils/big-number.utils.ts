import BigNumber from 'bignumber.js';

export const divBy1e18 = (value: BigNumber.Value) => new BigNumber(value).div(1e18);

export const mul = (mul1: BigNumber.Value, mul2: BigNumber.Value) => new BigNumber(mul1).times(mul2);

export const mulDiv = (mul1: BigNumber.Value, mul2: BigNumber.Value, div: BigNumber.Value) =>
  mul(mul1, mul2).div(div);

export const add = (a: BigNumber.Value, b: BigNumber.Value) => new BigNumber(a).plus(b);
