import Link from 'next/link';
import { styled } from 'styled-components';

const StyledDocsLinks = styled.section`
  display: flex;
  align-items: center;

  a {
    margin-left: 12px;
    font-weight: 600;
    font-size: 16px;
    text-decoration-line: none;
    color: #a8a8a8;
    transition: color 0.2s;

    @media (max-width: 1920px) {
      font-size: 14px;
    }

    @media (max-width: 1440px) {
      font-size: 12px;
    }

    @media (max-width: 1280px) {
      font-size: 10px;
    }

    &:hover,
    &:focus {
      color: #525252;
    }

    &:first-of-type {
      margin-left: 0;
    }
  }
`;

export const DocsLinks: React.FC = () => {
  return (
    <StyledDocsLinks>
      <Link href="/policy">Policy and Privacy</Link>
      <Link href="/terms-of-use">Terms of use</Link>
    </StyledDocsLinks>
  );
};
