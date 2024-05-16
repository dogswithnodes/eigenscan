import { styled } from 'styled-components';

import { StyledSpinner } from '../spinner/spinner.component';

import { mq } from '@/app/_utils/media-query.utils';

export const Background = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: #fff;
  border: 2px solid #ececec;
  border-radius: 6px;

  @media ${mq[1280]} {
    border-width: 1px;
  }
`;

export const PreloaderBackground = styled(Background)`
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
