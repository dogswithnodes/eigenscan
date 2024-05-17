import { useState, useEffect, useCallback, ChangeEvent, KeyboardEvent } from 'react';

import { StyledAutosizeInput } from './autosize-input.styled';

import { usePaginationContext } from '../../table-footer.component';

type Props = {
  pagesCount: number;
};

export const AutosizeInput: React.FC<Props> = ({ pagesCount }) => {
  const { currentPage, setCurrentPage } = usePaginationContext();
  const [val, setVal] = useState<number | ''>(currentPage);

  useEffect(() => {
    setVal(currentPage);
  }, [setVal, currentPage]);

  const onChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const input = Number(e.target.value);
      if (input < 0) {
        return setVal(1);
      }

      if (!input) {
        return setVal('');
      }

      if (!/^\d*$/.test(String(input))) {
        return setVal(pagesCount);
      }

      setVal(input > pagesCount ? pagesCount : input);
    },
    [pagesCount],
  );

  const submit = useCallback(() => {
    if (!val) {
      setVal(1);
    }
    setCurrentPage(!val ? 1 : val);
  }, [val, setCurrentPage]);

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        submit();
      }
    },
    [submit],
  );

  return (
    <StyledAutosizeInput>
      <input
        value={val}
        onChange={onChange}
        onKeyDown={onKeyDown}
        onBlur={submit}
        className="autosize-input-field"
      />
      <span className="autosize-input-filler">{val}</span>
    </StyledAutosizeInput>
  );
};
