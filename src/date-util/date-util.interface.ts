import { LocaleType, TimeZoneType } from './date-util-base.type';

export interface DatetimeProperties {
  year: number;
  month: number;
  week: number;
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

export interface TimeAnnotationSet {
  SSS: string;
  s: string;
  m: string;
  H: string;
  D: string;
  M: string;
  Y: string;
}
