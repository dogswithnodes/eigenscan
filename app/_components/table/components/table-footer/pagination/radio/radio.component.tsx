import { useRef, ChangeEvent, KeyboardEvent } from 'react';

import { Label, Input, Span } from './radio.styled';

type Props = {
  value: number;
  checked: boolean;
  onPerPageChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

export const Radio: React.FC<Props> = ({ value, checked, onPerPageChange }) => {
  const ref = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && ref.current) {
      ref.current.click();
    }
  };

  return (
    <Label role="radio" aria-checked={checked}>
      <Input
        ref={ref}
        onChange={onPerPageChange}
        type="radio"
        name="perpage"
        value={value}
        checked={checked}
      />
      <Span onKeyDown={handleKeyDown} tabIndex={0} $checked={checked}>
        {value}
      </Span>
    </Label>
  );
};
