import styled from 'styled-components';

export const DetailsContainer = styled.article`
  display: grid;
  grid-template-columns: 1fr 1fr;
  background-color: #192434;
  border-top: 2px solid #243855;
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
  background-color: #243855;
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
`;

export const TablePad = styled.div`
  background-color: #192434;
`;

export const Table = styled.table`
  margin: 15px 0;
  width: 100%;
  border-collapse: collapse;
`;

const cellStyles = `
  padding: 6px 28px;
  white-space: nowrap;
  cursor: default;
`;

export const Tr = styled.tr`
  &:hover {
    background-color: #243855;
  }
`;

export const Th = styled.th`
  ${cellStyles}
  font-weight: 500;
  font-size: 20px;
  display: flex;
  text-align: left;
  color: #859ec3;

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
  font-weight: 600;
  font-size: 20px;
  text-align: right;
  color: #fff;

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
    color: #3e7cf4;
    outline: none;
    transition: color 0.2s;

    &:hover,
    &:focus {
      color: #3b73df;
    }

    &:active {
      color: #3269d2;
    }
  }
`;

export const Postfix = styled.span`
  font-size: 18px;
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

export const DetailsPreloader = styled.div`
  background-color: #192434;
  border-radius: 6px;
`;
