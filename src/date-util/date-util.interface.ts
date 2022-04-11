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

// Todo: timezone과 locale에 리터럴 타입 적용
export interface LocalDateTimeFormatOpts {
  withYear?: boolean;
  timeZone: string;
  locale: string;
  formatStyle: 'long' | '2-digit';
}
