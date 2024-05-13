import { ChangeEvent, KeyboardEvent, useState } from 'react';

import { StyledSearchInput } from './search-input.styled';
import enter from './images/enter.svg';

import close from '@/app/_assets/images/close.svg';

type Props = {
  searchTerm: string;
  placeholder: string;
  setSearchTerm: (searchTerm: string) => void;
};

export const SearchInput: React.FC<Props> = ({ searchTerm, placeholder, setSearchTerm }) => {
  const [value, setValue] = useState(searchTerm);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setSearchTerm(value);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;

    if (!/(^[-\w \\.]+$|^$)/.test(input)) {
      return;
    }

    setValue(e.target.value);
  };

  const handleClick = () => {
    setSearchTerm(value);
  };

  const clearInput = () => {
    setValue('');
    setSearchTerm('');
  };

  return (
    <StyledSearchInput>
      <input
        className="search-input-field"
        value={value}
        placeholder={placeholder}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
      {value.length > 0 && (
        <button className="search-input-clear" onClick={clearInput}>
          <img src={close.src} alt="clear input" width={14} height={13} />
        </button>
      )}
      <button className="search-input-enter" onClick={handleClick}>
        <img src={enter.src} alt="submit input" width="19" height="17" />
      </button>
    </StyledSearchInput>
  );
};
