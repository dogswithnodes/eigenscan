import { useMediaQuery } from 'react-responsive';

export const mq = {
  1920: '(max-width: 1920px)',
  1440: '(max-width: 1440px)',
  1280: '(max-width: 1280px)',
};

export const useMq = (width: keyof typeof mq) => useMediaQuery({ query: mq[width] });
