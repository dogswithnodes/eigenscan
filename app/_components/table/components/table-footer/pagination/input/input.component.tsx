import { useState, useEffect, useCallback, ChangeEvent, KeyboardEvent } from 'react';
import AutosizeInput from 'react-input-autosize';

import { Wrapper } from './input.styled';

import { usePaginationContext } from '../../table-footer.component';

type Props = {
  pagesCount: number;
};

export const Input: React.FC<Props> = ({ pagesCount }) => {
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

  const onKeyPress = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        submit();
      }
    },
    [submit],
  );

  return (
    <Wrapper>
      <AutosizeInput
        autoComplete="off"
        value={val}
        onChange={onChange}
        onKeyPress={onKeyPress}
        onBlur={submit}
        inputStyle={{
          fontSize: 12,
        }}
      />
    </Wrapper>
  );
};
