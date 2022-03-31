import { ISO8601FormatType } from './date-util.type';

export interface DatetimeOpts {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
}

export interface DateFormatOpts {
  format?: string;
  isUTC?: boolean;
}

export interface ISODateFormatOpts {
  format?: ISO8601FormatType;
  isUTC?: boolean;
}

// Todo: timezone과 locale에 리터럴 타입 적용
export interface LocalDateTimeFormatOpts {
  withYear?: boolean;
  timeZone: string;
  locale: string;
  formatStyle: 'long' | '2-digit';
}
