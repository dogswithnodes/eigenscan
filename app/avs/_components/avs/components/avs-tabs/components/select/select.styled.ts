import Select from 'react-select';
import { styled } from 'styled-components';

export const StyledSelect = styled(Select)`
  .react-select {
    &__control {
      min-width: 175px;
      height: 40px;
      min-height: 34px;
      background-color: #243855;
      border: none;
      border-radius: 4px;
      box-shadow: none;
      cursor: pointer;
      transition: none;

      @media (max-width: 1920px) {
        min-width: 160px;
        height: 38px;
      }

      @media (max-width: 1440px) {
        min-width: 145px;
        height: 36px;
      }

      @media (max-width: 1280px) {
        min-width: 130px;
        height: 34px;
      }

      &--menu-is-open {
        border-bottom-right-radius: 0;
        border-bottom-left-radius: 0;

        .react-select__indicator {
          transform: rotate(-180deg);
        }
      }
    }

    &__value-container {
      margin-left: 10px;
      padding: 0;
      height: 100%;
    }

    &__placeholder {
      font-weight: 500;
      font-size: 20px;
      line-height: 1;
      color: #859ec3;

      @media (max-width: 1920px) {
        font-size: 18px;
      }

      @media (max-width: 1440px) {
        font-size: 16px;
      }

      @media (max-width: 1280px) {
        font-size: 14px;
      }
    }

    &__single-value {
      font-weight: 600;
      font-size: 20px;
      line-height: 1.2;
      color: #b7c8e2;

      @media (max-width: 1920px) {
        font-size: 18px;
      }

      @media (max-width: 1440px) {
        font-size: 16px;
      }

      @media (max-width: 1280px) {
        font-size: 14px;
      }
    }

    &__indicator-separator {
      display: none;
    }

    &__indicator {
      color: #fff;
      transition: 0.2s;

      &:hover {
        color: #fff;
      }
    }

    &__menu {
      margin: 0;
      background-color: #243855;
      border-top: 2px solid #3b5170;
      border-radius: 4px;
      border-top-right-radius: 0;
      border-top-left-radius: 0;
      z-index: 100;

      @media (max-width: 1280px) {
        border-top-width: 1px;
      }
    }

    &__menu-list {
      padding: 0;

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

    &__option {
      font-weight: 500;
      font-size: 20px;
      line-height: 1;
      color: #859ec3;
      background-color: transparent;

      cursor: pointer;
      white-space: nowrap;

      @media (max-width: 1920px) {
        font-size: 18px;
      }

      @media (max-width: 1440px) {
        font-size: 16px;
      }

      @media (max-width: 1280px) {
        font-size: 14px;
      }

      &:hover {
        color: #b7c8e2;
        background-color: #3b5170;
      }

      &:last-of-type:hover {
        border-bottom-left-radius: 4px;
        border-bottom-right-radius: 4px;
      }

      &--is-selected {
        color: #b7c8e2;
      }
    }
  }
`;
