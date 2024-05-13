import { useEffect, useState, MouseEvent, ReactNode } from 'react';

import { StyledModal } from './modal.styled';
import { Portal } from './components/portal/portal.component';

import { CloseButton } from '../close-button/close-button.styled';

import { useBodyScrollLock } from '@/app/_utils/body-scroll-lock.utils';
import { ChildrenProp } from '@/app/_models/children-prop.model';

const ANIMATION_DURATION = 250;

type Props = {
  isVisible: boolean;
  title?: ReactNode;
  onCancel?: () => void;
} & ChildrenProp;

export const Modal: React.FC<Props> = ({ isVisible, title, onCancel, children, ...rest }) => {
  const [modalState, setModalState] = useState<'visible' | 'hidden' | 'fading'>(
    isVisible ? 'visible' : 'hidden',
  );

  const isHidden = modalState === 'hidden';

  useEffect(() => {
    if (isVisible) {
      setModalState('visible');
    } else {
      setModalState((prevState) => {
        if (prevState === 'visible') {
          setTimeout(() => setModalState('hidden'), ANIMATION_DURATION);
          return 'fading';
        }

        return 'hidden';
      });
    }
  }, [isVisible]);

  useBodyScrollLock(!isHidden);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Escape' && isVisible) {
        onCancel?.();
      }
    };

    if (!isHidden) {
      window.addEventListener('keydown', handleKeyDown);
    } else {
      window.removeEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isHidden, isVisible, modalState, onCancel]);

  const handleBackgroundMouseDown = (e: MouseEvent) => {
    e.target === e.currentTarget && onCancel?.();
  };

  return (
    <Portal>
      {!isHidden && (
        <StyledModal
          onMouseDown={handleBackgroundMouseDown}
          className={modalState}
          $animationDuration={ANIMATION_DURATION}
          {...rest}
        >
          <article className="modal-window">
            <div className="modal-close-button-box">
              <CloseButton onClick={onCancel}>
                <svg
                  width="14"
                  height="13"
                  viewBox="0 0 14 13"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <line
                    x1="12"
                    y1="1.41421"
                    x2="2.41421"
                    y2="11"
                    stroke="#95B0D9"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <line
                    x1="1"
                    y1="-1"
                    x2="14.5563"
                    y2="-1"
                    transform="matrix(0.707107 0.707107 0.707107 -0.707107 2.27725 0)"
                    stroke="#95B0D9"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </CloseButton>
            </div>
            <header className="modal-header">
              {title && (
                <>
                  <h2 className="modal-title">{title}</h2>
                  <hr className="modal-line" />
                </>
              )}
            </header>
            <section className="modal-content">{children}</section>
          </article>
        </StyledModal>
      )}
    </Portal>
  );
};
