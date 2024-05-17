import { styled, css } from 'styled-components';

export const Label = styled.label`
  margin-left: 12px;
  position: relative;
  display: block;
`;

export const Span = styled.span<{ $checked: boolean }>`
  padding: 3px 6px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 500;
  color: #000;
  border: 1px solid #000;
  border-radius: 4px;
  outline: none;
  transition: 0.2s;
  cursor: pointer;

  ${(p) =>
    p.$checked
      ? css`
          background-color: #fce202;
          box-shadow: 0px 3px 0px rgba(0, 0, 0, 1);
          pointer-events: none;
        `
      : css`
          background-color: #fff;

          &:hover,
          &:focus {
            box-shadow: 0px 3px 0px rgba(0, 0, 0, 1);
          }

          &:active {
            box-shadow: 0px 1px 0px rgba(0, 0, 0, 1);
          }
        `}
`;

export const Input = styled.input`
  position: absolute;
  opacity: 0;
  height: 0;
  width: 0;
  cursor: pointer;
`;
