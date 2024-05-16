import { styled } from 'styled-components';

import { mq } from '@/app/_utils/media-query.utils';

export const StyledNavButton = styled.button`
  margin-right: 8px;
  width: 24px;
  height: 24px;
  padding: 0;
  box-shadow: ${({ disabled }) => (disabled ? 'none' : '0px 1px 0px rgba(0, 0, 0, 1)')};
  border: none;
  border-radius: 50%;
  background-color: transparent;
  outline: none;
  cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};

  &:last-of-type {
    margin-right: 0;
  }

  &:hover,
  &:focus {
    box-shadow: ${({ disabled }) => (disabled ? 'none' : '0px 2px 0px rgba(0, 0, 0, 1)')};
  }

  &:active {
    box-shadow: ${({ disabled }) => (disabled ? 'none' : '0px 0px 0px rgba(0, 0, 0, 1)')};
  }

  @media ${mq[1920]} {
    width: 22px;
    height: 22px;
  }

  @media ${mq[1440]} {
    width: 20px;
    height: 20px;
  }

  @media ${mq[1280]} {
    min-width: 18px;
    width: 18px;
    height: 18px;
  }

  svg {
    width: 100%;
    height: 100%;
    transform: scaleX(${(props) => (props['aria-label'] === 'previous' ? '1' : '-1')});
    transition: fill 0.2s;
  }

  rect {
    stroke: ${({ disabled }) => (disabled ? '#ECECEC' : '#000')};
    transition: stroke 0.2s;
  }
  line {
    stroke: ${({ disabled }) => (disabled ? '#ECECEC' : '#000')};
    transition: stroke 0.2s;
  }
`;
