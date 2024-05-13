import { styled } from 'styled-components';

import { mq } from '@/app/_utils/media-query.utils';

export const AccountButton = styled.button`
  margin-right: 6px;

  &:last-child {
    margin-right: 0;
  }

  &:hover,
  &:focus {
    rect {
      fill: #344967;
      stroke: #344967;
    }
  }

  &:active {
    rect {
      fill: #283a53;
      stroke: #283a53;
    }
  }

  svg {
    width: 32px;
    height: 22px;

    @media ${mq[1920]} {
      width: 30px;
      height: 20px;
    }

    @media ${mq[1440]} {
      width: 28px;
      height: 18px;
    }

    @media ${mq[1280]} {
      width: 26px;
      height: 16px;
    }

    rect {
      fill: #3b5170;
      transition: 0.2s;
    }

    path {
      fill: #fff;
    }

    line {
      stroke: #fff;
    }
  }
`;
