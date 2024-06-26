'use client';
import type BigNumber from 'bignumber.js';
import Link from 'next/link';
import numbro from 'numbro';
import { ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { styled } from 'styled-components';

import { divBy1e18 } from './big-number.utils';
import { formatTableDate } from './table.utils';
import { clampMiddle } from './text.utils';

import { ExternalLink } from '../_components/external-link/external-link.component';
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

const TooltipImageGroup = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
`;

const visibleImages = 4;

export const renderImageGroup = (srcs: Array<string>) => {
  const plusMore = srcs.length > visibleImages ? srcs.length - visibleImages : 0;

  return (
    <ImageGroup>
      {srcs.slice(0, visibleImages).map((src) => (
        <img key={src} src={src} alt="" width="25" height="25" />
      ))}
      {plusMore > 0 && (
        <>
          {' '}
          <span
            data-tooltip-id={GLOBAL_TOOLTIP_ID}
            data-tooltip-html={renderToStaticMarkup(
              <TooltipImageGroup>
                {srcs.slice(visibleImages).map((src) => (
                  <img key={src} src={src} alt="" width="25" height="25" />
                ))}
              </TooltipImageGroup>,
            )}
          >
            +{plusMore}
          </span>
        </>
      )}
    </ImageGroup>
  );
};

export const renderAddressLink = (type: 'avs' | 'profile' | 'strategy', tab?: string, children?: ReactNode) =>
  function AddressLink(address: string | null) {
    return address ? (
      <Link
        prefetch={false}
        href={`/${type}?id=${address}${tab ? `&tab=${tab}` : ''}`}
        className="ant-table-cell-monospaced-value"
        data-tooltip-id={GLOBAL_TOOLTIP_ID}
        data-tooltip-content={address}
      >
        {children || clampMiddle(address)}
      </Link>
    ) : null;
  };

export const renderDate = (date: string | null) =>
  date ? <span className="ant-table-cell-monospaced-value">{formatTableDate(date)}</span> : null;

const formatTooltipBnValue = (value: BigNumber) =>
  value.absoluteValue().gte(1) ? value.toFormat(2) : value.toString();

export const _renderBN = (optionalTooltip?: boolean) => {
  return function RenderedBigNumber(bn: BigNumber | string) {
    const value = divBy1e18(bn);
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

export const renderBigNumber = _renderBN();

export const renderTransactionHash = (value: string) => (
  <ExternalLink
    href={`https://etherscan.io/tx/${value}`}
    data-tooltip-id={GLOBAL_TOOLTIP_ID}
    data-tooltip-content={value}
  >
    {clampMiddle(value)}
  </ExternalLink>
);
