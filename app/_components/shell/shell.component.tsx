'use client';
import { ShellContent, StyledShell } from './shell.styled';
import { Header } from './components/header/header.component';

import { ChildrenProp } from '@/app/_models/children-prop.model';

export const Shell: React.FC<ChildrenProp> = ({ children }) => {
  return (
    <StyledShell>
      <Header />
      <ShellContent as="main">{children}</ShellContent>
    </StyledShell>
  );
};
