import { styled } from 'styled-components';

import { mq } from '@/app/_utils/media-query.utils';

export const Wrapper = styled.div`
  margin: 0 6px 0 12px;

  input {
    padding: 1px 8px;
    min-width: 53px;
    text-align: center;
    font-size: 18px !important;
    color: #000;
    letter-spacing: 0.2em;
    background-color: #fff;
    border: 1px solid #ececec;
    border-radius: 4px;
    outline: none;
    transition: 0.2s;

    @media ${mq[1920]} {
      padding: 1px 8px;
      min-width: 48px;
      font-size: 16px !important;
    }

    @media ${mq[1440]} {
      padding: 2px 8px;
      min-width: 43px;
      font-size: 14px !important;
    }

    @media ${mq[1280]} {
      padding: 2px 8px;
      min-width: 37px;
      font-size: 12px !important;
    }
  }
`;
