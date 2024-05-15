import { styled } from 'styled-components';

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
  line-height: 1;
  color: #859ec3;
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

export const TabsHeaderContent = styled.section`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
  width: 100%;
`;
