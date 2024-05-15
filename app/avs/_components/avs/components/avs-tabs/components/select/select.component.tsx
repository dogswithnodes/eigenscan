import { Props } from 'react-select';

import { StyledSelect } from './select.styled';

export const Select: React.FC<Props> = (props) => {
  return <StyledSelect {...props} classNamePrefix="react-select" isSearchable={false} />;
};
