'use client';
import { Header } from './components/header/header.component';
import { ShellContent, StyledShell } from './shell.styled';

import { ChildrenProp } from '@/app/_models/children-prop.model';

export const Shell: React.FC<ChildrenProp> = ({ children }) => {
  return (
    <StyledShell>
      <Header />
      <ShellContent as="main">{children}</ShellContent>
    </StyledShell>
  );
};
