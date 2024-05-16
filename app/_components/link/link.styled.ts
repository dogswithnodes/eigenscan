import { styled } from 'styled-components';

export const Link = styled.a`
  color: #6830ff;
  font-weight: 400;
  text-decoration: none;
  outline: none;
  cursor: pointer;
  transition: 0.2s;

  &:hover,
  &:focus {
    color: #4313c3;
  }

  &:active {
    color: #6830ff;
  }
`;
