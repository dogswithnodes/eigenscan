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
  border-radius: 4px;
  outline: none;
  transition: 0.2s;
  cursor: pointer;

  ${(p) =>
    p.$checked
      ? css`
          font-weight: 600;
          color: #fff;
          background-color: #3e7cf4;
          box-shadow: 0px 2px 8px rgba(62, 124, 244, 0.3);
          pointer-events: none;
        `
      : css`
          font-weight: 500;
          color: #859ec3;
          background-color: #243855;

          &:hover,
          &:focus {
            background-color: #203451;
          }

          &:active {
            background-color: #1a2f4d;
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
