import DOMPurify from 'dompurify';
import { renderToStaticMarkup } from 'react-dom/server';

import { ExternalLink } from '../_components/external-link/external-link.component';

const uriRegexp =
  /https:\/\/[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/g;

export const parseLinks = (text: string | undefined) =>
  DOMPurify.sanitize(
    text?.replaceAll(uriRegexp, (match) =>
      renderToStaticMarkup(<ExternalLink href={match}>{match}</ExternalLink>),
    ) ?? '',
    {
      USE_PROFILES: {
        html: true,
      },
      ADD_ATTR: ['target'],
    },
  );
