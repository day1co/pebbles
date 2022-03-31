import { DatetimeOpts } from './date-util.interface';

export type DateType = string | number | Date;
export type CalcDatetimeOpts = Partial<DatetimeOpts>;

export type DatePropertyType = 'year' | 'month' | 'day' | 'hour' | 'minute' | 'second';

export type ISO8601FormatType =
  | 'YYYY'
  | 'YYYYMMDD'
  | 'YYYY-MM'
  | 'YYYY-MM-DD'
  | 'YYYY-MM-DDTHH:mm:ss'
  | 'YYYY-MM-DDTHH:mm:ss.SSS'
  | 'HH:mm:ss.SSS'
  | 'HH:mm:ss'
  | 'HH:mm'
  | 'HH';
