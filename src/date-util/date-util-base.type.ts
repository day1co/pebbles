import {
  DATE_FORMAT,
  DATETIME_FORMAT,
  DATETIME_FORMAT_WITH_MILLIS,
  TIMEZONE_UTC,
  TIMEZONE_PST,
  TIMEZONE_TOKYO,
  TIMEZONE_SEOUL,
} from './date-util.const';

export type DateType = string | number | Date;
export type DatePropertyType = 'year' | 'month' | 'day' | 'hour' | 'minute' | 'second';
export type LocaleType = 'en' | 'ja' | 'ko';
export type TimeZoneType = typeof TIMEZONE_SEOUL | typeof TIMEZONE_TOKYO | typeof TIMEZONE_PST | typeof TIMEZONE_UTC;
export type Iso8601FormatType = typeof DATE_FORMAT | typeof DATETIME_FORMAT | typeof DATETIME_FORMAT_WITH_MILLIS;
