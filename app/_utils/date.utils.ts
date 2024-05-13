import { format } from 'date-fns';
import { curry } from 'ramda';

export const unixTimeToDateString = curry((template: string, unixTime: number | string) =>
  format(new Date(Number(unixTime) * 1000), template),
);
