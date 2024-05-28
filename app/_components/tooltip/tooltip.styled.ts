import { Tooltip as ReactTooltip } from 'react-tooltip';
import { styled } from 'styled-components';

import { mq } from '@/app/_utils/media-query.utils';

export const StyledReactTooltip = styled(ReactTooltip)`
  max-width: 50vw;

  .react-tooltip-arrow {
    border-bottom: 1px solid #ececec;
    border-right: 1px solid #ececec;
  }

  &.tooltip {
    padding: 10px;
    font-weight: 500;
    font-size: 18px;
    line-height: 1.3;
    color: #000;
    background-color: #fff;
    border: 1px solid #ececec;
    border-radius: 6px;
    pointer-events: auto;
    z-index: 110;
    opacity: 1;

    @media ${mq[1920]} {
      font-size: 16px;
    }

    @media ${mq[1440]} {
      font-size: 14px;
    }

    @media ${mq[1280]} {
      font-size: 12px;
    }

    &.place-top,
    &.place-bottom,
    &.place-left,
    &.place-right {
      &:before {
        width: 11px;
        height: 11px;
        background-color: #fff;
        border-top: none;
        border-left: none;
        border-right: none;
        border-bottom: none;
        transform: rotate(45deg);
      }

      &:after {
        display: none;
      }
    }

    &.place-top {
      margin-top: -5px;

      &:before {
        bottom: -6px;
      }
    }

    &.place-bottom {
      margin-top: 5px;

      &:before {
        top: -6px;
      }
    }

    &.place-left {
      &:before {
        right: -6px;
      }
    }

    &.place-right {
      &:before {
        left: -6px;
      }
    }

    &.place-top,
    &.place-botton {
      &:before {
        margin-left: -6px;
      }
    }

    &.place-left,
    &.place-right {
      margin-top: 0px;

      &:before {
        margin-top: -6px;
      }
    }
  }
`;
