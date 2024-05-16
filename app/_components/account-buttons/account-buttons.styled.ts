import { styled } from 'styled-components';

import { mq } from '@/app/_utils/media-query.utils';

export const StyledAccountButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const AccountButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  border: 1px solid #000;
  border-radius: 50%;

  @media ${mq[1920]} {
    width: 26px;
    height: 26px;
  }

  @media ${mq[1440]} {
    width: 24px;
    height: 24px;
  }

  @media ${mq[1280]} {
    width: 22px;
    height: 22px;
  }

  &:hover,
  &:focus {
    box-shadow: 0px 2px 0px rgba(0, 0, 0, 1);
  }

  &:active {
    box-shadow: 0px 1px 0px rgba(0, 0, 0, 1);
  }
`;
