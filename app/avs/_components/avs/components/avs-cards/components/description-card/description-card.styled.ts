import { styled } from 'styled-components';

export const Description = styled.section`
  padding: 16px 26px;
  min-height: 118px;

  @media (max-width: 1920px) {
    min-height: 110px;
  }

  @media (max-width: 1440px) {
    min-height: 102px;
  }

  @media (max-width: 1280px) {
    min-height: 96px;
  }
`;

export const DescriptionHeading = styled.h3`
  margin-bottom: 10px;
  font-weight: 600;
  font-size: 20px;
  color: #a6bbdd;

  @media (max-width: 1920px) {
    font-size: 18px;
  }

  @media (max-width: 1440px) {
    font-size: 16px;
  }

  @media (max-width: 1280px) {
    font-size: 14px;
  }
`;

export const DescriptionText = styled.p`
  font-weight: 500;
  font-size: 20px;
  line-height: 1.36;
  color: #fff;
  cursor: default;

  @media (max-width: 1920px) {
    font-size: 18px;
  }

  @media (max-width: 1440px) {
    font-size: 16px;
  }

  @media (max-width: 1280px) {
    font-size: 14px;
  }
`;
