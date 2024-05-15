import { styled, css } from 'styled-components';

import { Background } from '../background/background.styled';

const cardsMinHeight = css`
  min-height: 198px;

  @media (max-width: 1920px) {
    min-height: 190px;
  }

  @media (max-width: 1440px) {
    min-height: 182px;
  }

  @media (max-width: 1280px) {
    min-height: 174px;
  }
`;

export const Card = styled.section`
  background-color: #1a2637;
  border-radius: 6px;
`;

export const Cards = styled.section`
  margin: 16px 0 32px;
  display: grid;
  gap: 28px;
  grid-template-columns: 1.5fr 1fr;
  ${cardsMinHeight}
`;

export const CardPreloader = styled(Background)`
  ${cardsMinHeight}

  svg {
    width: 30px;
    height: 30px;

    @media (max-width: 1920px) {
      width: 28px;
      height: 28px;
    }

    @media (max-width: 1440px) {
      width: 26px;
      height: 26px;
    }

    @media (max-width: 1280px) {
      width: 24px;
      height: 24px;
    }
  }
`;
