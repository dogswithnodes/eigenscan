import { styled } from 'styled-components';

import { Container } from '../container/container.styled';

import { mq } from '@/app/_utils/media-query.utils';
import { fontFamily } from '@/app/fonts';

export const StyledHeader = styled.header`
  padding: 26px 0;
  width: 100%;

  @media ${mq[1440]} {
    padding: 24px 0;
  }

  .header-title {
    font-family: ${fontFamily.thunder};
    font-size: 38px;
    color: #000;
    font-weight: bold;
    letter-spacing: 0.05em;
    text-decoration: none;
    cursor: pointer;
    user-select: none;

    @media ${mq[1920]} {
      font-size: 36px;
    }

    @media ${mq[1440]} {
      font-size: 34px;
    }

    @media ${mq[1280]} {
      font-size: 32px;
    }

    &[aria-disabled='true'] {
      pointer-events: none;
    }
  }

  .header-title-scan {
    color: #3418da;
  }
`;

export const HeaderContent = styled(Container)`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 62px;
`;
