import { ButtonHTMLAttributes } from 'react';
import { styled } from 'styled-components';

import expand from './images/expand.svg';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  isExpanded: boolean;
};

const StyledExpandButton = styled.div<Props>`
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #000;
  border-radius: 50%;
  flex-shrink: 0;
  width: 22px;
  height: 22px;
  cursor: pointer;

  img {
    user-select: none;
    transform: rotate(${(p) => (p.isExpanded ? '-180deg' : '0')});
    transition: 0.2s ease-out;
  }
`;

export const ExpandButton: React.FC<Props> = ({ isExpanded, ...rest }) => {
  return (
    <StyledExpandButton isExpanded={isExpanded} {...rest}>
      <img src={expand.src} width="10" height="6" alt="Expandable" />
    </StyledExpandButton>
  );
};
