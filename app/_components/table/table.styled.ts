import { styled } from 'styled-components';

import { StyledSpinner } from '../spinner/spinner.component';

import { mq } from '@/app/_utils/media-query.utils';
import { fontFamily } from '@/app/fonts';

export const STICKY_SCROLL_CLASSNAME = 'ant-table-sticky-scroll';

export const LoadScreen = styled.div<{ $spinnerTop: number }>`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.4);
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
  z-index: 100;

  .load-screen-spinner-container {
    position: absolute;
    top: ${({ $spinnerTop }) => `${$spinnerTop}px`};
    left: 50%;
    transform: translate(-50%, -50%);
  }

  ${StyledSpinner} {
    width: 70px;
    height: 70px;

    @media ${mq[1920]} {
      width: 60px;
      height: 60px;
    }

    @media ${mq[1440]} {
      width: 50px;
      height: 50px;
    }

    @media ${mq[1280]} {
      width: 40px;
      height: 40px;
    }
  }
`;

export const StyledTable = styled.section`
  position: relative;

  .ant-table {
    font-size: 18px;
    box-sizing: border-box;
    position: relative;

    @media ${mq[1920]} {
      font-size: 16px;
    }

    @media ${mq[1440]} {
      font-size: 14px;
    }

    @media ${mq[1280]} {
      font-size: 12px;
    }
  }

  .ant-table table {
    width: 100%;
    border-spacing: 0px;
  }

  .ant-table-thead {
    color: #525252;
  }

  .ant-table-header {
    border-right: 2px solid #ececec;
    border-left: 2px solid #ececec;

    @media ${mq[1280]} {
      border-width: 1px;
    }
  }

  .ant-table-body {
    overflow-x: auto;
    border: 2px solid #ececec;
    border-bottom-left-radius: 6px;
    border-bottom-right-radius: 6px;

    @media ${mq[1280]} {
      border-width: 1px;
    }

    ::-webkit-scrollbar {
      height: 20px;

      @media ${mq[1440]} {
        height: 18px;
      }

      @media ${mq[1280]} {
        height: 16px;
      }
    }

    ::-webkit-scrollbar-track {
      background: #fff;
      border-bottom-left-radius: 6px;
      border-bottom-right-radius: 6px;
    }

    ::-webkit-scrollbar-thumb {
      background: #ededed;
      border: 6px solid #fff;
      border-radius: 10px;

      @media ${mq[1280]} {
        border: 5px solid #fff;
      }
    }

    scrollbar-color: #ededed #fff;
  }

  .ant-table .ant-table-cell {
    vertical-align: middle;
    background-color: #fcfcfc;
    border-right: 2px solid #ececec;

    @media ${mq[1280]} {
      border-width: 1px;
    }

    &:last-child {
      border-right: none;
    }

    &_sorted {
      .ant-table-sort-icon {
        display: block;
      }

      &_desc {
        .ant-table-sort-icon {
          display: block;
          top: auto;
          bottom: 5px;
          transform: translateX(-50%);
        }
      }
    }

    &.ant-table-cell-fix-left {
      z-index: 2;
    }
  }

  .ant-table th {
    position: sticky;
    padding: 28px 10px;
    text-align: center;
    border-top: 2px solid #ececec;
    text-overflow: ellipsis;
    cursor: pointer;

    @media ${mq[1920]} {
      padding: 24px 10px;
    }

    @media ${mq[1440]} {
      padding: 20px 10px;
    }

    @media ${mq[1280]} {
      padding: 18px 10px;
      border-width: 1px;
    }
  }

  .ant-table td {
    position: relative;
    padding: 14px 10px;
    text-align: right;
    font-weight: 500;
    color: #525252;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: default;

    @media ${mq[1920]} {
      padding: 12px 10px;
    }

    @media ${mq[1440]} {
      padding: 10px 10px;
    }

    @media ${mq[1280]} {
      padding: 8px 10px;
    }

    &:first-child {
      text-align: left;
    }

    &.ant-table-cell {
      &_with-link {
        color: #6830ff;

        &:hover {
          color: #4313c3;
        }

        &:active {
          color: #6830ff;
        }
      }

      &_row-hovered {
        background-color: #ddd !important;
      }

      &_img {
        background-color: #e5e5e5;
      }

      &_left-aligned {
        text-align: left;
      }

      &_button-container {
        height: 55px;

        @media ${mq[1920]} {
          height: 49px;
        }

        @media ${mq[1440]} {
          height: 42px;
        }

        @media ${mq[1280]} {
          height: 46px;
        }
      }
    }

    .ant-table-cell-monospaced-value {
      font-family: ${fontFamily.robotoMono};
    }

    .ant-table-cell-normal-font-value {
      font-family: ${fontFamily.montserrat};
    }
  }

  .ant-table a {
    font-family: ${fontFamily.robotoMono};
    font-weight: 500;
    font-size: 18px;
    color: #6830ff;
    text-decoration: none;
    outline: none;
    transition: color 0.2s;

    @media ${mq[1920]} {
      font-size: 16px;
    }

    @media ${mq[1440]} {
      font-size: 14px;
    }

    @media ${mq[1280]} {
      font-size: 12px;
    }

    &:hover,
    &:focus {
      color: #4313c3;
    }

    &:active {
      color: #6830ff;
    }
  }

  .ant-table img {
    margin: 0 auto;
  }

  .ant-table-column-title-container {
    display: grid;
    justify-items: center;
    align-items: center;
    width: 100%;
    height: 24px;
  }

  .ant-table-column-title {
    padding-bottom: 1px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    font-weight: 500;
    width: 100%;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .ant-table-sort-icon {
    display: none;
    position: absolute;
    top: 5px;
    left: 50%;
    transform: scaleY(-1) translateX(-50%);
    transition: transform 0.3s;

    div {
      width: 14px;
      height: 10px;

      @media ${mq[1920]} {
        width: 13px;
        height: 9px;
      }

      @media ${mq[1440]} {
        width: 12px;
        height: 8px;
      }

      @media ${mq[1280]} {
        width: 11px;
        height: 7px;
      }
    }
  }

  .ant-table .ant-table-column {
    &_sorted {
      color: #000;
      background-color: #fff;
    }
  }

  .ant-table-row {
    &:last-of-type {
      td {
        border-bottom: 2px solid #ececec;

        @media ${mq[1280]} {
          border-bottom-width: 1px;
        }
      }
    }
  }

  .ant-table-sticky-holder {
    position: sticky;
    z-index: 3;
    overflow: visible !important;
  }

  .${STICKY_SCROLL_CLASSNAME} {
    height: 20px !important;
    position: sticky;
    bottom: 0;
    z-index: 3;
    display: -webkit-box;
    display: flex;
    align-items: center;
    background: #fff;
    border-top: 1px solid #fff;

    @media ${mq[1440]} {
      height: 18px !important;
    }

    @media ${mq[1280]} {
      height: 16px !important;
    }

    &:hover {
      transform-origin: center bottom;
    }

    &:after {
      position: absolute;
      content: '';
      top: 0;
      left: 0;
      right: 0;
      height: 2px;
      background-color: #ededed;
      transform: translateY(-100%);

      @media ${mq[1280]} {
        height: 1px;
      }
    }
  }

  .ant-table-sticky-scroll-bar {
    height: 100%;
    background-color: #ededed;
    border: 6px solid #fff;
    border-radius: 10px;

    @media ${mq[1280]} {
      border: 5px solid #fff;
    }
  }

  .ant-table-expanded-row .ant-table-cell {
    border-top: 2px solid #ececec;
    border-bottom: 2px solid #ececec;

    @media ${mq[1280]} {
      border-width: 1px;
    }
  }
`;
