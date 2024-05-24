import Select from 'react-select';
import { styled } from 'styled-components';

export const StyledSelect = styled(Select)`
  .react-select {
    &__control {
      min-width: 175px;
      height: 40px;
      min-height: 34px;
      background-color: #fce202;
      border: 2px solid #000;
      border-radius: 4px;
      box-shadow: none;
      cursor: pointer;
      transition: none;

      &:hover {
        border: 2px solid #000;
      }

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
        border-width: 1px;
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
      color: #000;

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
      color: #000;

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
      color: #000;
      transition: 0.2s;

      &:hover {
        color: #000;
      }
    }

    &__menu {
      margin: 0;
      background-color: #fff;
      border: 2px solid #000;
      border-top: none;
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
        background: #fff;
      }

      ::-webkit-scrollbar-thumb {
        background: #fff;
        border: 5px solid #ededed;
        border-radius: 14px;
      }
    }

    &__option {
      font-weight: 500;
      font-size: 20px;
      color: #525252;
      font-weight: 400;
      background-color: transparent;
      transition: 0.2s;

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
        color: #000;
        background-color: #f6f6f6;
      }

      &:last-of-type:hover {
        border-bottom-left-radius: 4px;
        border-bottom-right-radius: 4px;
      }

      &--is-selected {
        color: #000;
        font-weight: 500;
      }
    }
  }
` as typeof Select;
