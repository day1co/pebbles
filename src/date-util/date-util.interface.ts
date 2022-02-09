import { ISO8601FormatType } from './date-util.type';

export interface CalcDatetimeOpts {
  readonly year?: number;
  readonly month?: number;
  readonly date?: number;
  readonly hour?: number;
  readonly minute?: number;
  readonly second?: number;
}

export interface DateFormatOpts {
  readonly format?: string;
  readonly isUTC?: boolean;
}

export interface ISODateFormatOpts {
  readonly format: ISO8601FormatType;
  readonly isUTC?: boolean;
}

export interface LocalDateTimeFormatOpts {
  readonly withYear?: boolean;
  readonly timeZone: string;
  readonly locale: string;
}
