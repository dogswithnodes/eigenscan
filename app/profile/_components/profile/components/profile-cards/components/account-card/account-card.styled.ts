import { styled } from 'styled-components';

export const HashImageContainer = styled.div<{ size: number }>`
  width: ${({ size }) => `${size + 10}px`};
  height: ${({ size }) => `${size + 10}px`};
  background-color: #2b3e58;
  border-radius: 50%;
  border: 2px solid #3b5170;
  overflow: hidden;

  @media (max-width: 1920px) {
    width: ${({ size }) => `${size + 8}px`};
    height: ${({ size }) => `${size + 8}px`};
  }

  @media (max-width: 1440px) {
    width: ${({ size }) => `${size + 4}px`};
    height: ${({ size }) => `${size + 4}px`};
  }

  @media (max-width: 1280px) {
    border-width: 1px;
  }

  img {
    width: 100%;
    height: 100%;
  }
`;
