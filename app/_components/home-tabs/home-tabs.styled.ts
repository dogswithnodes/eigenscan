import { styled } from 'styled-components';

import { Tabs } from '../tabs/tabs.styled';

import { mq } from '@/app/_utils/media-query.utils';

export const StyledHomeTabs = styled(Tabs)`
  justify-content: space-between;
  align-items: center;
  gap: 24px;

  .home-tabs-extra-content {
    display: flex;
    align-items: center;
    flex-basis: 780px;
    width: 100%;

    @media ${mq[1920]} {
      flex-basis: 670px;
    }

    @media ${mq[1440]} {
      flex-basis: 590px;
    }

    @media ${mq[1280]} {
      flex-basis: 530px;
    }
  }
`;

export const TabButtons = styled.section`
  display: flex;

  a {
    margin-left: 12px;
    text-decoration: none;

    &:first-of-type {
      margin-left: 0;
    }
  }
`;
