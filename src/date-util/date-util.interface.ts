import { LocaleType, TimeZoneType } from './date-util-base.type';

export interface DatetimeProperties {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
}

export interface FormatOpts<Type extends string> {
  format: Type;
  isUtc: boolean;
  locale: LocaleType;
  timeZone: TimeZoneType;
}

/** @deprecated */
export interface LocalDateTimeFormatOpts {
  withYear?: boolean;
  timeZone: TimeZoneType;
  locale: LocaleType;
  formatStyle: 'long' | '2-digit';
}
