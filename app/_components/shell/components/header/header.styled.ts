import { styled } from 'styled-components';

import { Container } from '../container/container.styled';

import { mq } from '@/app/_utils/media-query.utils';

export const StyledHeader = styled.header`
  padding: 31px 0;
  width: 100%;

  @media ${mq[1920]} {
    padding: 30px 0;
  }

  @media ${mq[1440]} {
    padding: 29px 0;
  }

  @media ${mq[1280]} {
    padding: 28px 0;
  }

  .header-title {
    font-size: 30px;
    color: #fff;
    font-weight: bold;
    text-transform: uppercase;
    text-decoration: none;
    text-shadow:
      rgba(192, 219, 255, 0.48) 0px 0px 80px,
      rgba(65, 120, 255, 0.24) 0px 0px 32px;
    transition: 0.2s;
    cursor: pointer;
    user-select: none;

    @media ${mq[1920]} {
      font-size: 28px;
    }

    @media ${mq[1440]} {
      font-size: 26px;
    }

    @media ${mq[1280]} {
      font-size: 24px;
    }

    &:hover,
    &:focus {
      color: #ccd7e7;
    }

    &:active {
      color: #a8bbd4;
    }

    &[aria-disabled='true'] {
      pointer-events: none;
    }
  }
`;

export const HeaderContent = styled(Container)`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 62px;
`;
