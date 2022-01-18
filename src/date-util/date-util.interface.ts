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

export interface LocalDateTimeFormatOpts {
  readonly withYear?: boolean;
  readonly timeZone: string;
  readonly locale: string;
}
