import { styled } from 'styled-components';

export const Container = styled.article`
  padding: 16px 12px 16px 0;
  display: flex;
  width: 100%;
  height: 100%;
`;

export const Left = styled.section`
  margin: 0 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 140px;
`;

export const Right = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-grow: 1;
  min-height: 132px;

  @media (max-width: 1920px) {
    min-height: 122px;
  }

  @media (max-width: 1440px) {
    min-height: 112px;
  }

  @media (max-width: 1280px) {
    min-height: 106px;
  }
`;

export const ImageBox = styled.div`
  img {
    width: 112px;
    height: 112px;

    @media (max-width: 1920px) {
      width: 108px;
      height: 108px;
    }

    @media (max-width: 1440px) {
      width: 104px;
      height: 104px;
    }

    @media (max-width: 1280px) {
      width: 100px;
      height: 100px;
    }
  }
`;

export const Name = styled.p`
  margin-top: 8px;
  width: 140px;
  font-weight: 700;
  font-size: 20px;
  line-height: 1.14;
  color: #dae3ef;
  text-align: center;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
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

export const Title = styled.header`
  position: relative;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  min-height: 40px;

  @media (max-width: 1920px) {
    min-height: 38px;
  }

  @media (max-width: 1440px) {
    min-height: 36px;
  }

  @media (max-width: 1280px) {
    min-height: 34px;
  }
`;

export const Heading = styled.h2<{ warning?: boolean }>`
  margin-right: ${({ warning }) => (warning ? '0' : '12px')};
  max-width: 650px;
  font-weight: bold;
  font-size: 26px;
  line-height: 1.15;
  color: #dae3ef;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: default;

  @media (max-width: 1920px) {
    max-width: 400px;
    font-size: 24px;
  }

  @media (max-width: 1440px) {
    max-width: 315px;
    font-size: 22px;
  }

  @media (max-width: 1280px) {
    max-width: 300px;
    font-size: 20px;
  }
`;

export const Created = styled.p`
  margin-left: auto;
  width: max-content;
  font-weight: 500;
  font-size: 18px;
  line-height: 1;
  color: #859ec3;

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
