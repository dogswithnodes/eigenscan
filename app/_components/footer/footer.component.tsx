import { styled } from 'styled-components';

import { FooterContainer } from '../footer-container/footer-container.styled';
import { DocsLinks } from '../docs-links/docs-links.component';

const Container = styled(FooterContainer)`
  padding: 40px 0;
  justify-content: flex-end;
`;

export const Footer: React.FC = () => {
  return (
    <footer>
      <Container>
        <DocsLinks />
      </Container>
    </footer>
  );
};
