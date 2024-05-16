import { css, styled } from 'styled-components';

import { fontFamily } from '@/app/_styles/font-family';

export const DetailsContainer = styled.article`
  display: grid;
  grid-template-columns: 1fr 1fr;
  border: 2px solid #ececec;
  overflow: hidden;
  border-bottom-right-radius: 6px;
  border-bottom-left-radius: 6px;

  @media (max-width: 1280px) {
    border-top-width: 1px;
  }
`;

export const DetailsContainerWithPad = styled(DetailsContainer)`
  background-color: transparent;
  gap: 2px;

  @media (max-width: 1280px) {
    gap: 1px;
  }
`;

export const ContainerPad = styled.div`
  background-color: #ececec;
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
`;

export const TablePad = styled.div`
  background-color: #fcfcfc;
`;

export const Table = styled.table`
  margin: 15px 0;
  width: 100%;
  border-collapse: collapse;
`;

const cellStyles = css`
  padding: 6px 28px;
  white-space: nowrap;
  cursor: default;
`;

export const Tr = styled.tr`
  &:hover {
    background-color: #f6f6f6;
  }
`;

export const Th = styled.th`
  ${cellStyles}
  font-weight: 500;
  font-size: 20px;
  display: flex;
  text-align: left;
  color: #525252;

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

export const Td = styled.td`
  ${cellStyles}
  font-weight: bold;
  font-size: 20px;
  text-align: right;
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

  a {
    color: #6830ff;
    font-weight: 500;
    outline: none;
    transition: color 0.2s;

    &:hover,
    &:focus {
      color: #4313c3;
    }

    &:active {
      color: #6830ff;
    }
  }

  a.monospaced {
    ${fontFamily.robotoMono}
  }
`;

export const Postfix = styled.span`
  font-size: 18px;
  color: #000;
  font-weight: 400;

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
