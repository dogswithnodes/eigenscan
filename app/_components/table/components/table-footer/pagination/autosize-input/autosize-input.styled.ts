import { styled } from 'styled-components';

import { mq } from '@/app/_utils/media-query.utils';

export const StyledAutosizeInput = styled.div`
  margin: 0 6px 0 12px;
  padding: 1px 8px;
  display: inline-grid;
  align-items: center;
  justify-items: start;
  width: min-content;
  min-width: 53px;
  font-size: 18px;
  letter-spacing: 0.2em;
  color: #000;
  background-color: #fff;
  border: 1px solid #ececec;
  border-radius: 4px;

  @media ${mq[1920]} {
    min-width: 48px;
    font-size: 16px;
  }

  @media ${mq[1440]} {
    padding: 2px 8px;
    min-width: 43px;
    font-size: 14px;
  }

  @media ${mq[1280]} {
    min-width: 37px;
    font-size: 12px;
  }

  .autosize-input-field {
    padding: 0;
    width: 100%;
    text-align: center;
    border: none;
    outline: none;
  }

  .autosize-input-filler {
    visibility: hidden;
  }

  .autosize-input-field,
  .autosize-input-filler {
    grid-area: 1 / 1 / 2 / 2;
    font-size: inherit;
    letter-spacing: inherit;
    color: inherit;
  }
`;
