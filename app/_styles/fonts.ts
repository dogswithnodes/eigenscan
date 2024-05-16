'use client';
import { createGlobalStyle } from 'styled-components';

export const Fonts = createGlobalStyle`
  @font-face {
    font-family: 'Montserrat';
    src: url(/fonts/montserrat-regular.woff2) format('woff2');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Montserrat';
    src: url(/fonts/montserrat-light.woff2) format('woff2');
    font-weight: 300;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Montserrat';
    src: url(/fonts/montserrat-medium.woff2) format('woff2');
    font-weight: 500;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Montserrat';
    src: url(/fonts/montserrat-semi-bold.woff2) format('woff2');
    font-weight: 600;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Montserrat';
    src: url(/fonts/montserrat-bold.woff2) format('woff2');
    font-weight: bold;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Thunder';
    src: url(/fonts/thunder-bold.woff2) format('woff2');
    font-weight: bold;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Roboto Mono';
    src: url(/fonts/roboto-mono-medium.woff2) format('woff2');
    font-weight: 500;
    font-style: normal;
    font-display: swap;
  }
`;
