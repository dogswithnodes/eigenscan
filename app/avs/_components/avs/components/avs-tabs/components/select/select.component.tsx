import { StyledSelect } from './select.styled';

export const Select: typeof StyledSelect = (props) => {
  return <StyledSelect {...props} classNamePrefix="react-select" isSearchable={false} />;
};
