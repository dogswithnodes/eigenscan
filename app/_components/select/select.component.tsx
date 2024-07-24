import { components } from 'react-select';

import { StyledSelect } from './select.styled';

const ClearIndicator: typeof components.ClearIndicator = (props) => {
  return (
    <components.ClearIndicator {...props}>
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="x" clip-path="url(#clip0_14736_130682)">
          <path
            id="Line 223"
            d="M1 1.17969L8.77817 8.95786"
            stroke="#000"
            stroke-width="1.5"
            stroke-linecap="round"
          />
          <path
            id="Line 224"
            d="M8.78125 1.17969L1.00308 8.95786"
            stroke="#000"
            stroke-width="1.5"
            stroke-linecap="round"
          />
        </g>
        <defs>
          <clipPath id="clip0_14736_130682">
            <rect width="10" height="10" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </components.ClearIndicator>
  );
};

export const Select: typeof StyledSelect = (props) => {
  return (
    <StyledSelect
      {...props}
      classNamePrefix="react-select"
      isSearchable={false}
      components={{ ...props.components, ClearIndicator }}
    />
  );
};
