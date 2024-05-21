import { BigNumberish } from 'ethers';
import numbro from 'numbro';

export const formatNumber = (value: BigNumberish, mantissa = 1) =>
  numbro(value)
    .format({
      average: true,
      mantissa,
    })
    .toUpperCase();

export const formatTableNumber = (value: number | string) =>
  numbro(value)
    .format(
      Math.abs(Number(value)) >= 1e6
        ? {
            average: true,
            mantissa: 1,
            forceAverage: 'million',
          }
        : Math.abs(Number(value)) >= 1e4
          ? {
              average: true,
              mantissa: 1,
              forceAverage: 'thousand',
            }
          : {
              average: true,
              mantissa: 1,
            },
    )
    .toUpperCase();

const shouldBeRounded = (value: number) => Math.abs(value) >= 1000;

const separateThousands = (value: number) => {
  const parts = Math.abs(value) > 1 ? String(value.toFixed(2)).split('.') : value.toPrecision(2).split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  parts[1] = typeof parts[1] === 'undefined' ? '00' : parts[1].length < 2 ? `${parts[1]}0` : parts[1];
  return parts.join('.');
};

export const formatTooltipNumber = (value: number) => separateThousands(value);

export const formatOptionalTooltipNumber = (value: number) => {
  return shouldBeRounded(value) || (Math.abs(value) < 1 && Math.abs(value) > 0)
    ? separateThousands(value)
    : null;
};
