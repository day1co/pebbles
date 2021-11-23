export interface CalcDatetimeOpts {
  readonly year?: number;
  readonly month?: number;
  readonly date?: number;
  readonly hour?: number;
  readonly minute?: number;
  readonly second?: number;
}

export interface DateInfo {
  year: number;
  month: number;
  date: number;
  hour: number;
  minute: number;
  second: number;
  millisecond: number;
}
