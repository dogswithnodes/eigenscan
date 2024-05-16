import { styled, css } from 'styled-components';

import { mq } from '@/app/_utils/media-query.utils';

export const Tabs = styled.section`
  position: relative;
  padding: 18px 16px 18px 28px;
  display: flex;
  border: 2px solid #ececec;
  border-bottom: none;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  background-color: #fff;

  @media ${mq[1280]} {
    border-width: 1px;
  }
`;

export const TabButtons = styled.section`
  display: flex;
  gap: 12px;

  a {
    text-decoration: none;
  }
`;

export const TabButton = styled.div<{ $active: boolean }>`
  padding: 7px 14px;
  font-size: 20px;
  font-weight: 500;
  color: #000;
  border: 1px solid #000;
  border-radius: 6px;
  transition: 0.2s;

  ${(p) =>
    p.$active
      ? css`
          background-color: #fce202;
          box-shadow: 2px 3px 0px rgba(0, 0, 0, 1);
          pointer-events: none;
        `
      : css`
          background-color: #fff;
          cursor: pointer;

          &:hover,
          &:focus {
            box-shadow: 1px 2px 0px rgba(0, 0, 0, 1);
          }

          &:active {
            box-shadow: 0px 1px 0px rgba(0, 0, 0, 1);
          }
        `}

  @media ${mq[1920]} {
    font-size: 18px;
  }

  @media ${mq[1440]} {
    font-size: 16px;
  }

  @media ${mq[1280]} {
    font-size: 14px;
  }
`;

export const TabContent = styled.article<{ $footerPressedToBottom?: boolean }>`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: ${(p) => (p.$footerPressedToBottom ? 'space-between' : 'flex-start')};
  width: 100%;
  height: 100%;
`;

export const Fieldset = styled.fieldset`
  margin: 0 0 0 52px;
  padding: 25px 0 5px;
  width: 100%;
  border: none;

  @media (max-width: 1920px) {
    padding: 20px 0 5px;
  }

  @media (max-width: 1440px) {
    padding: 15px 0 5px;
  }

  @media (max-width: 1280px) {
    padding: 10px 0 5px;
  }

  &:first-of-type {
    margin-left: 0;
  }
`;

export const Legend = styled.legend`
  font-weight: 600;
  font-size: 20px;
  color: #525252;
  white-space: nowrap;

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
