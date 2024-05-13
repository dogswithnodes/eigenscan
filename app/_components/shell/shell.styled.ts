import { styled } from 'styled-components';

import { Container } from './components/container/container.styled';

export const StyledShell = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  min-width: 960px;
  min-height: 100vh;
  width: 100%;
`;

export const ShellContent = styled(Container)`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  min-height: 100%;
`;
