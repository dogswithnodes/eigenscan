import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { HeaderContent, StyledHeader } from './header.styled';

import { preventDefault } from '@/app/_utils/events.utils';

const titleHref = '/';

export const Header: React.FC = () => {
  const pathname = usePathname();

  return (
    <StyledHeader>
      <HeaderContent>
        <Link
          href={titleHref}
          className="header-title"
          aria-disabled={pathname === titleHref}
          onMouseDown={preventDefault}
        >
          eigenscan
        </Link>
      </HeaderContent>
    </StyledHeader>
  );
};
