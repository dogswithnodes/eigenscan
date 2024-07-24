import { styled } from 'styled-components';

export const TabsHeaderContent = styled.section`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
  width: 100%;
`;

export const QuorumSelectBox = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  .quorum-select-box-text {
    font-weight: 600;
    font-size: 20px;
    color: #000;

    @media (max-width: 1920px) {
      font-size: 18px;
    }

    @media (max-width: 1440px) {
      font-size: 16px;
    }

    @media (max-width: 1280px) {
      font-size: 14px;
    }
  }
`;
