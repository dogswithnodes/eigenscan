import { AutosizeInput } from './autosize-input/autosize-input.component';
import { NavButton } from './nav-button/nav-button.component';
import { Wrapper, NavContainer, Count } from './pagination.styled';
import { RadioGroup } from './radio-group/radio-group.component';

import { usePaginationContext } from '../table-footer.component';

export const Pagination: React.FC = () => {
  const { currentPage, total, perPage, setCurrentPage } = usePaginationContext();

  const pagesCount = Math.ceil(total / perPage);
  const renderNavButton = (ariaLabel: 'previous' | 'next', navigatePerPage: boolean) => (
    <NavButton
      currentPage={currentPage}
      pagesCount={pagesCount}
      disabled={ariaLabel === 'previous' ? currentPage <= 1 : currentPage >= pagesCount}
      ariaLabel={ariaLabel}
      navigatePerPage={navigatePerPage}
      setCurrentPage={setCurrentPage}
    />
  );

  return (
    <Wrapper>
      <RadioGroup />
      <NavContainer>
        {renderNavButton('previous', false)}
        {renderNavButton('previous', true)}
        <AutosizeInput pagesCount={pagesCount} />
        <Count>of {pagesCount}</Count>
        {renderNavButton('next', true)}
        {renderNavButton('next', false)}
      </NavContainer>
    </Wrapper>
  );
};
