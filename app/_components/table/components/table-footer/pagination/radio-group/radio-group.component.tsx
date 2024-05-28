import { ChangeEvent, useCallback } from 'react';

import { Container, Description } from './radio-group.styled';

import { usePaginationContext } from '../../table-footer.component';
import { Radio } from '../radio/radio.component';

export const RadioGroup: React.FC = () => {
  const { perPageOptions, setPerPage } = usePaginationContext();

  const handlePerPageChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => setPerPage(parseInt(e.target.value)),
    [setPerPage],
  );

  return (
    <Container>
      <Description>Items per page:</Description>
      {perPageOptions.map(({ value, checked }) => (
        <Radio key={value} value={value} checked={checked} onPerPageChange={handlePerPageChange} />
      ))}
    </Container>
  );
};
