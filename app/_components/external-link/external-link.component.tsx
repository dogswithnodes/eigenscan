import { LinkHTMLAttributes } from 'react';

import { ChildrenProp } from '@/app/_models/children-prop.model';
import { preventDefault } from '@/app/_utils/events.utils';

export const ExternalLink = ({
  href,
  children,
  onMouseDown,
  ...rest
}: LinkHTMLAttributes<HTMLAnchorElement> & ChildrenProp) => (
  <a
    {...rest}
    href={href}
    target="_blank"
    rel="noreferrer"
    onMouseDown={(e) => {
      preventDefault(e);
      onMouseDown?.(e);
    }}
  >
    {children}
  </a>
);
