import { styled } from 'styled-components';

import { mq } from '@/app/_utils/media-query.utils';

export const StyledModal = styled.div<{ $animationDuration: number }>`
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 100;
  animation: fadeIn 0.25s;

  &.fading {
    animation: fadeOut ${({ $animationDuration }) => $animationDuration / 1000}s;
  }

  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  @keyframes fadeOut {
    0% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }

  .modal-window {
    position: relative;
    margin: 20px;
    display: flex;
    flex-direction: column;
    max-height: calc(100vh - 40px);
    background-color: #1a2637;
    box-shadow:
      0px 6px 6px rgba(0, 0, 0, 0.05),
      0px 2px 2px rgba(0, 0, 0, 0.08),
      inset 0px 1px 1px #253450;
    border-radius: 6px;
    overflow: hidden;
  }

  .modal-header {
    flex-shrink: 0;
  }

  .modal-close-button-box {
    position: absolute;
    top: 12px;
    right: 16px;
  }

  .modal-title {
    padding: 24px 24px 0;
    margin-bottom: 20px;
    width: 100%;
    text-align: center;
    font-weight: 600;
    font-size: 24px;
    line-height: 1;
    color: #95b0d9;

    @media ${mq[1920]} {
      font-size: 22px;
    }

    @media ${mq[1440]} {
      font-size: 20px;
    }

    @media ${mq[1280]} {
      font-size: 18px;
    }
  }

  hr.modal-line {
    margin: 0;
    border-color: transparent;
    border-top: 2px solid #304462;

    @media ${mq[1280]} {
      border-width: 1px;
    }
  }

  .modal-content {
    position: relative;
    padding: 20px 24px;
    max-height: calc(100vh - 130px);
    overflow-y: auto;

    ::-webkit-scrollbar {
      width: 15px;
      height: 15px;
    }

    ::-webkit-scrollbar-track {
      background: #1a2637;
    }

    ::-webkit-scrollbar-thumb {
      background: #243855;
      border: 5px solid #1a2637;
      border-radius: 14px;
    }
  }
`;
