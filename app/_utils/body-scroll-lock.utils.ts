import { useEffect, useRef, useState } from 'react';

export const useBodyScrollLock = (active: boolean) => {
  const [prevActive, setPrevActive] = useState(active);

  const verticalPosition = useRef(0);

  useEffect(() => {
    const { body } = document;

    const setActiveStyles = () => {
      if (window.scrollY !== 0) {
        verticalPosition.current = window.scrollY;
      }
      body.style.overflow = 'hidden';
      body.style.position = 'fixed';
      body.style.width = '100%';
      body.style.top = `-${verticalPosition.current}px`;
    };

    const removeBodyInlineStyles = () => {
      ['overflow', 'position', 'top', 'width'].forEach((x) => body.style.removeProperty(x));
      setPrevActive(false);
    };

    const observer = new MutationObserver(() => {
      if (body.style.overflow === '') {
        setActiveStyles();
      }
    });

    if (active) {
      setActiveStyles();
      setPrevActive(active);
      observer.observe(body, { attributeFilter: ['style'] });
    } else {
      observer.disconnect();
      if (prevActive) {
        removeBodyInlineStyles();
        window.scrollTo({ top: verticalPosition.current });
        verticalPosition.current = 0;
      }
    }

    return () => {
      removeBodyInlineStyles();
      observer.disconnect();
    };
  }, [active, prevActive]);
};
