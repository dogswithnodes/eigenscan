'use client';
import { ITooltip } from 'react-tooltip';

import { StyledReactTooltip } from './tooltip.styled';

export const Tooltip: React.FC<ITooltip> = ({ id, ...rest }) => {
  return <StyledReactTooltip id={id} className="tooltip" arrowColor="#273c5E" wrapper="section" {...rest} />;
};
