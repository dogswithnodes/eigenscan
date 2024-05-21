'use client';
import Link from 'next/link';
import { styled } from 'styled-components';
import BigNumber from 'bignumber.js';
import numbro from 'numbro';

import { formatTableNumber, formatTooltipNumber } from './number.utils';
import { preventDefault } from './events.utils';
import { formatTableDate } from './table.utils';
import { clampMiddle } from './text.utils';

import { GLOBAL_TOOLTIP_ID } from '../_constants/tooltip.constants';

import noData from '@/app/_assets/images/no-data.svg';

export const renderImage = (src?: string | null) => {
  return <img src={src || noData.src} alt="" width="25" height="25" />;
};

const ImageGroup = styled.section`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 8px;

  img {
    margin: 0 !important;
  }
`;

export const renderImageGroup = (srcs: Array<string>) => {
  const plusMore = srcs.length > 4 ? srcs.length - 4 : 0;

  return (
    <ImageGroup>
      {srcs.slice(0, 4).map((src) => (
        <img key={src} src={src} alt="" width="25" height="25" />
      ))}{' '}
      {plusMore > 0 && `+${plusMore}`}
    </ImageGroup>
  );
};

export const renderAddressLink = (type: 'avs' | 'profile' | 'strategy', tab?: string) =>
  function AddressLink(address: string | null) {
    return address ? (
      <Link
        href={`/${type}?id=${address}${tab ? `&tab=${tab}` : ''}`}
        className="ant-table-cell-monospaced-value"
        data-tooltip-id={GLOBAL_TOOLTIP_ID}
        data-tooltip-content={address}
      >
        {clampMiddle(address)}
      </Link>
    ) : null;
  };

export const renderDate = (date: string | null) =>
  date ? <span className="ant-table-cell-monospaced-value">{formatTableDate(date)}</span> : null;
// TODO bignumber
export const renderBigNumber = (number: number) => (
  <span data-tooltip-id={GLOBAL_TOOLTIP_ID} data-tooltip-content={formatTooltipNumber(number)}>
    {formatTableNumber(number)}
  </span>
);

const formatTooltipBnValue = (value: BigNumber) =>
  value.absoluteValue().gte(1) ? value.toFormat(2) : value.toString();

export const _renderBN = (optionalTooltip?: boolean) => {
  return function RenderedBigNumber(bn: BigNumber | string) {
    const value = new BigNumber(bn).div(1e18);
    const absValue = value.absoluteValue();

    const tooltipContent = !optionalTooltip
      ? formatTooltipBnValue(value)
      : value.gte(1000) || (absValue.lt(1) && absValue.gt(0))
        ? formatTooltipBnValue(value)
        : null;

    const format: numbro.Format = {
      average: true,
      mantissa: 1,
    };

    if (value.gte(1e6)) {
      format.forceAverage = 'million';
    } else if (value.gte(1e4)) {
      format.forceAverage = 'thousand';
    }

    return (
      <span data-tooltip-id={GLOBAL_TOOLTIP_ID} data-tooltip-content={tooltipContent}>
        {numbro(value.toFixed()).format(format).toUpperCase()}
      </span>
    );
  };
};

export const renderBNWithOptionalTooltip = _renderBN(true);

export const renderBN = _renderBN();

export const renderTransactionHash = (value: string) => (
  <a
    onMouseDown={preventDefault}
    href={`https://etherscan.io/tx/${value}`}
    target="_blank"
    rel="noreferrer"
    data-tooltip-id={GLOBAL_TOOLTIP_ID}
    data-tooltip-content={value}
  >
    {clampMiddle(value)}
  </a>
);
