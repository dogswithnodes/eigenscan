'use client';
import { createGlobalStyle } from 'styled-components';

import { fontFamily } from './font-family';

export const GlobalStyles = createGlobalStyle`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  body,
  h1,
  h2,
  h3,
  h4,
  p,
  figure,
  blockquote,
  dl,
  dd {
    margin: 0;
  }

  ul,
  ol {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  button {
    padding: 0;
    border: 0;
    background-color: transparent;
    outline: none;
    cursor: pointer;
  }

  body {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    text-rendering: optimizeSpeed;
    ${fontFamily.montserrat}
    font-weight: normal;
    line-height: 1.2;
    color: ##525252;
    background-color: #fff;

    @media (min-width: 960px) {
      margin-right: calc(100% - 100vw);
      overflow-x: hidden;
    }
  }

  a:not([class]) {
    text-decoration-skip-ink: auto;
  }

  img,
  picture {
    max-width: 100%;
    display: block;
    color: transparent;
  }

  input,
  button,
  textarea,
  select {
    font: inherit;
  }

  ::-webkit-scrollbar {
    width: 15px;
    height: 15px;
  }

  ::-webkit-scrollbar-track {
    background: #fff;
  }

  ::-webkit-scrollbar-thumb {
    background: #ededed;
    border: 4px solid #fff;
    border-radius: 10px;
  }
`;
