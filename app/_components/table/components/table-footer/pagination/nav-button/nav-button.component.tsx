import { StyledNavButton } from './nav-button.styled';

import { preventDefault } from '@/app/_utils/events.utils';

type Props = {
  ariaLabel: 'next' | 'previous';
  currentPage: number;
  pagesCount: number;
  disabled: boolean;
  setCurrentPage: (page: number) => void;
  navigatePerPage: boolean;
};

export const NavButton: React.FC<Props> = ({
  ariaLabel,
  disabled,
  currentPage,
  pagesCount,
  navigatePerPage,
  setCurrentPage,
}) => {
  const onClick = () =>
    setCurrentPage(
      ariaLabel === 'next'
        ? navigatePerPage
          ? currentPage + 1
          : pagesCount
        : navigatePerPage
          ? currentPage - 1
          : 1,
    );

  return (
    <StyledNavButton
      onMouseDown={preventDefault}
      onClick={onClick}
      aria-label={ariaLabel}
      disabled={disabled}
    >
      {navigatePerPage ? (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="0.5" y="0.500012" width="19" height="19" rx="9.5" stroke="#000" />
          <line
            x1="8.06063"
            y1="10"
            x2="11"
            y2="12.9394"
            stroke="#000"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <line
            x1="11"
            y1="7.06068"
            x2="8.06063"
            y2="10"
            stroke="#000"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="0.5" y="0.5" width="17" height="17" rx="8.5" stroke="#000" />
          <line
            x1="9.06066"
            y1="9"
            x2="12"
            y2="11.9393"
            stroke="#000"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <line
            x1="12"
            y1="6.06066"
            x2="9.06066"
            y2="9"
            stroke="#000"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <line
            x1="5.06066"
            y1="9"
            x2="8"
            y2="11.9393"
            stroke="#000"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <line
            x1="8"
            y1="6.06066"
            x2="5.06066"
            y2="9"
            stroke="#000"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      )}
    </StyledNavButton>
  );
};
