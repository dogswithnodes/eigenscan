'use client';
import { styled } from 'styled-components';

export const FilterButton = styled.button<{ $active: boolean }>`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 0;
  right: 0;
  bottom: 0;
  width: 40px;
  background: ${(p) => (p.$active ? '#fce202' : '#e5e5e5')};
`;

export const FilterMenu = styled.section`
  position: absolute;
  margin: 4px 2px 0 0;
  top: 100%;
  right: 0;
  width: fit-content;
  min-width: 100px;
  background-color: #fff;
  border: 2px solid #000;
  border-radius: 4px;
  z-index: 100;

  @media (max-width: 1280px) {
    border-width: 1px;
  }

  .filter-menu-item {
    padding: 8px 12px;
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 18px;
    color: #525252;
    font-weight: 500;
    transition: 0.2s;
    cursor: pointer;
    white-space: nowrap;

    &:hover,
    &:focus-visible,
    &[aria-checked='true'] {
      color: #000;
      background: #f6f6f6;
    }

    &[aria-checked='true'] {
      .filter-menu-checkbox {
        background: #fce202;

        svg {
          width: 80%;
        }
      }
    }

    @media (max-width: 1920px) {
      font-size: 16px;
    }

    @media (max-width: 1440px) {
      padding: 6px 10px;
      gap: 6px;
      font-size: 14px;
    }

    @media (max-width: 1280px) {
      font-size: 12px;
    }
  }

  .filter-menu-checkbox {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 18px;
    height: 18px;
    border-radius: 2px;
    border: 1px solid #000;

    @media (max-width: 1920px) {
      width: 16px;
      height: 16px;
    }

    @media (max-width: 1440px) {
      width: 14px;
      height: 14px;
    }

    @media (max-width: 1280px) {
      width: 12px;
      height: 12px;
    }
  }

  .filter-menu-buttons {
    padding: 8px 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    cursor: default;

    @media (max-width: 1440px) {
      padding: 6px 10px;
    }

    button {
      font-weight: 600;
      color: #000;

      &:disabled {
        color: #d3d3d3;
        cursor: default;
      }
    }
  }
`;
