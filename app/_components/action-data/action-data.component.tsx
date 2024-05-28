import { ReactNode } from 'react';
import { styled } from 'styled-components';

import { ChildrenProp } from '@/app/_models/children-prop.model';

const StyledContainer = styled.section`
  padding-left: 44px;
  display: flex;
  align-items: center;
  gap: 32px;
  flex-wrap: wrap;
`;

const Container: React.FC<ChildrenProp> = ({ children }) => {
  return <StyledContainer>{children}</StyledContainer>;
};

const StyledEntry = styled.section`
  display: flex;
  align-items: center;
  gap: 8px;
  width: fit-content;
  flex-shrink: 0;

  .action-data-entry-title {
    font-weight: bold;
  }
`;

type EntryProps = {
  title: ReactNode;
  value: ReactNode;
};

const Entry: React.FC<EntryProps> = ({ title, value }) => {
  return (
    <StyledEntry>
      <section className="action-data-entry-title">{title}:</section>
      <section className="action-data-entry-value">{value}</section>
    </StyledEntry>
  );
};

export default {
  Container,
  Entry,
};
