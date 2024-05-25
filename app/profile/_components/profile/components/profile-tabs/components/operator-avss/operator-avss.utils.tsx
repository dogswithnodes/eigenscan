import { renderToStaticMarkup } from 'react-dom/server';
import { styled } from 'styled-components';

import { GLOBAL_TOOLTIP_ID } from '@/app/_constants/tooltip.constants';

const TooltipTokens = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
`;

const Token = styled.span`
  font-weight: bold;
`;

const visibleTokens = 1;

export const renderTokens = (tokens: Array<string>) => {
  const plusMore = tokens.length > visibleTokens ? tokens.length - visibleTokens : 0;

  return (
    <>
      {tokens.slice(0, visibleTokens).map((token) => (
        <Token key={token}>{token}</Token>
      ))}
      {plusMore > 0 && (
        <>
          {' '}
          <span
            data-tooltip-id={GLOBAL_TOOLTIP_ID}
            data-tooltip-html={renderToStaticMarkup(
              <TooltipTokens>
                {tokens.slice(visibleTokens).map((token) => (
                  <span key={token}>{token}</span>
                ))}
              </TooltipTokens>,
            )}
          >
            +{plusMore}
          </span>
        </>
      )}
    </>
  );
};
