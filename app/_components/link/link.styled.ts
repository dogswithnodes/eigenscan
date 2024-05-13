import { styled } from 'styled-components';

export const Link = styled.a`
  color: #3e7cf4;
  text-decoration: none;
  outline: none;
  cursor: pointer;
  transition: 0.2s;

  &:hover,
  &:focus {
    color: #3b73df;
  }

  &:active {
    color: #3269d2;
  }
`;
