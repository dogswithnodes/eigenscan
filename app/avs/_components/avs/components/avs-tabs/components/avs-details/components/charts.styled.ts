import { css, styled } from 'styled-components';

export const StyledCharts = styled.section`
  position: relative;
  border-left: 2px solid #ececec;

  .charts-title {
    position: absolute;
    bottom: calc(100% - 8px);
    left: 50%;
    font-size: 18px;
    transform: translate(-50%, 100%);

    @media (max-width: 1920px) {
      font-size: 16px;
    }

    @media (max-width: 1440px) {
      font-size: 14px;
    }

    @media (max-width: 1280px) {
      font-size: 12px;
    }
  }

  .charts-dots {
    position: absolute;
    display: flex;
    align-items: center;
    gap: 8px;
    top: calc(100% - 8px);
    left: 50%;
    transform: translate(-50%, -100%);
  }

  @media (max-width: 1280px) {
    border-width: 1px;
  }
`;

export const ChartDot = styled.button<{ $active: boolean }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  cursor: pointer;

  @media (max-width: 1440px) {
    width: 10px;
    height: 10px;
  }

  ${(p) =>
    p.$active
      ? css`
          background: #000;
          pointer-events: none;
        `
      : css`
          background: #525252;
        `}
`;

export const TooltipContent = styled.div`
  padding: 10px;
  color: #000;
  font-size: 12px;
  font-weight: 500;
  background-color: #fff;
  border: 1px solid #ececec;
  border-radius: 6px;
`;
