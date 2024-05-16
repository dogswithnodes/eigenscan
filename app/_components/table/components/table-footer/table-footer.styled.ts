import { styled } from 'styled-components';

import { FooterContainer } from '@/app/_components/footer-container/footer-container.styled';
import { mq } from '@/app/_utils/media-query.utils';

export const Wrapper = styled.footer`
  font-weight: 500;
  font-size: 18px;
  line-height: 1.33;

  @media (max-width: 1920px) {
    font-size: 16px;
  }

  @media (max-width: 1440px) {
    font-size: 14px;
  }

  @media (max-width: 1280px) {
    font-size: 12px;
  }
`;

export const Container = styled(FooterContainer)<{ $isLogoOnly: boolean }>`
  justify-content: space-between;
  flex-direction: ${(p) => (p.$isLogoOnly ? 'row-reverse' : 'row')};
`;

export const LeftSide = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

export const Result = styled.span`
  color: #525252;
`;

export const DownloadButtonContainer = styled.div`
  margin-left: 10px;
  width: 26px;
  height: 26px;

  @media ${mq[1920]} {
    width: 24px;
    height: 24px;
  }

  @media ${mq[1440]} {
    width: 22px;
    height: 22px;
  }

  @media ${mq[1280]} {
    width: 20px;
    height: 20px;
  }
`;

export const PaginationContainer = styled.div`
  max-width: 900px;
  margin-right: 130px;
  width: 46%;
`;
