import { styled } from 'styled-components';

import { mq } from '@/app/_utils/media-query.utils';

export const CONTAINER_PADDING = 30;

export const Container = styled.div`
  margin: 0 auto;
  max-width: calc(2065px + ${CONTAINER_PADDING * 2}px);
  padding: 0 ${CONTAINER_PADDING}px;
  width: 100%;

  @media ${mq[1920]} {
    max-width: calc(1440px + ${CONTAINER_PADDING * 2}px);
  }

  @media ${mq[1440]} {
    max-width: calc(1280px + ${CONTAINER_PADDING * 2}px);
  }

  @media ${mq[1280]} {
    max-width: calc(1184px + ${CONTAINER_PADDING * 2}px);
  }
`;
