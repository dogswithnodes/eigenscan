import { styled } from 'styled-components';

export const StyledSpinner = styled.div`
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border: 4px solid #384d6b;
  border-right-color: #23344f;
  border-top-color: #23344f;
  border-radius: 50%;

  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

/* eslint-disable max-len */
export const Spinner: React.FC = ({ ...rest }) => <StyledSpinner {...rest} />;
