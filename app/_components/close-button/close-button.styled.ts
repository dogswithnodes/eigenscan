import { styled } from 'styled-components';

export const CloseButton = styled.button`
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: transparent;
  border: none;
  outline: none;
  cursor: pointer;

  &:hover,
  &:focus {
    svg {
      line {
        stroke: #a3b7d6;
      }
    }
  }

  &:active {
    svg {
      line {
        stroke: #d7e3f4;
      }
    }
  }

  svg {
    line {
      stroke: #95b0d9;
      transition: stroke 0.2s;
    }
  }
`;
