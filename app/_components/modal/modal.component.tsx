import { useEffect, useState, MouseEvent, ReactNode } from 'react';

import { Portal } from './components/portal/portal.component';
import { StyledModal, CloseButton } from './modal.styled';

import close from '@/app/_assets/images/close.svg';
import { ChildrenProp } from '@/app/_models/children-prop.model';
import { useBodyScrollLock } from '@/app/_utils/body-scroll-lock.utils';

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
                <img src={close.src} alt="close" width={14} height={13} />
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
