import { SyntheticEvent } from 'react';

export const preventDefault = (e: SyntheticEvent | Event) => e.preventDefault();

export const stopPropagation = (e: SyntheticEvent | Event) => e.stopPropagation();
