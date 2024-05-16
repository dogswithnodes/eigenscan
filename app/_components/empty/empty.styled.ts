import { styled } from 'styled-components';

import { Background } from '../background/background.styled';

import { mq } from '@/app/_utils/media-query.utils';

export const StyledEmpty = styled(Background)`
  .empty-image-containter {
    margin-bottom: 20px;
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

    img {
      width: 100%;
    }
  }

  .empty-description {
    font-weight: 500;
    font-size: 20px;
    color: #525252;

    @media ${mq[1920]} {
      font-size: 18px;
    }

    @media ${mq[1440]} {
      font-size: 16px;
    }

    @media ${mq[1280]} {
      font-size: 14px;
    }
  }
`;
