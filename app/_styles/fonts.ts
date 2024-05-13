'use client';
import { createGlobalStyle } from 'styled-components';

export const Fonts = createGlobalStyle`
  @font-face {
    font-family: 'Montserrat';
    src: url(/fonts/montserrat-regular.woff2) format('woff2'),
      url(/fonts/montserrat-regular.woff) format('woff');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Montserrat';
    src: url(/fonts/montserrat-light.woff2) format('woff2'), url(/fonts/montserrat-light.woff) format('woff');
    font-weight: 300;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Montserrat';
    src: url(/fonts/montserrat-medium.woff2) format('woff2'),
      url(/fonts/montserrat-medium.woff) format('woff');
    font-weight: 500;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Montserrat';
    src: url(/fonts/montserrat-semi-bold.woff2) format('woff2'),
      url(/fonts/montserrat-semi-bold.woff) format('woff');
    font-weight: 600;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Montserrat';
    src: url(/fonts/montserrat-bold.woff2) format('woff2'), url(/fonts/montserrat-bold.woff) format('woff');
    font-weight: bold;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Roboto Mono';
    src: url(/fonts/roboto-mono-medium.woff2) format('woff2'),
      url(/fonts/roboto-mono-medium.woff) format('woff');
    font-weight: 500;
    font-style: normal;
    font-display: swap;
  }
`;
