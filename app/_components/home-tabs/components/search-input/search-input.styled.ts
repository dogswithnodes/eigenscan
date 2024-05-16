import { styled } from 'styled-components';

import { mq } from '@/app/_utils/media-query.utils';

export const StyledSearchInput = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: #fcfcfc;
  border: 1px solid #e1e1e1;
  border-radius: 6px;
  height: 38px;

  @media ${mq[1920]} {
    height: 36px;
  }

  @media ${mq[1440]} {
    height: 34px;
  }

  @media ${mq[1280]} {
    height: 32px;
  }

  .search-input-field {
    padding: 0 0 0 16px;
    flex-grow: 1;
    width: 100%;
    height: 100%;
    font-weight: 600;
    line-height: 1;
    color: #525252;
    border: none;
    outline: none;
    background-color: transparent;

    &::placeholder {
      font-weight: 500;
      color: #a0a0a0;
    }
  }

  .search-input-clear {
    margin: 0 8px;
    display: flex;
    flex-shrink: 0;

    img {
      width: 16px;
      height: 16px;

      @media ${mq[1920]} {
        width: 14px;
        height: 14px;
      }

      @media ${mq[1440]} {
        width: 12px;
        height: 12px;
      }

      @media ${mq[1280]} {
        width: 10px;
        height: 10px;
      }
    }
  }

  .search-input-enter {
    margin-right: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;

    img {
      width: 22px;
      height: 22px;

      @media ${mq[1920]} {
        width: 20px;
        height: 20px;
      }

      @media ${mq[1440]} {
        width: 18px;
        height: 18px;
      }

      @media ${mq[1280]} {
        width: 16px;
        height: 16px;
      }
    }
  }
`;
