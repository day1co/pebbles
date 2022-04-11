import { DATE_FORMAT, DATETIME_FORMAT, DATETIME_FORMAT_WITH_MILLIS } from './date-util.const';

export type DateType = string | number | Date;
export type DatePropertyType = 'year' | 'month' | 'day' | 'hour' | 'minute' | 'second';
export type LocaleType = 'en-US' | 'ja' | 'ko';
export type TimeZoneType = 'Asia/Seoul' | 'Asia/Tokyo' | 'PST' | 'UTC';
export type Iso8601FormatType = typeof DATE_FORMAT | typeof DATETIME_FORMAT | typeof DATETIME_FORMAT_WITH_MILLIS;
