import { DatetimeProperties, FormatOpts } from './date-util.interface';
import { DATETIME_FORMAT_WITH_MILLIS, DEFAULT_DATE_FORMAT, DEFAULT_DATETIME_FORMAT } from './date-util.const';

export type DateType = string | number | Date;
export type CalcDatetimeOpts = Partial<DatetimeProperties>;
export type DatePropertyType = 'year' | 'month' | 'day' | 'hour' | 'minute' | 'second';

export type Iso8601FormatType =
  | typeof DEFAULT_DATETIME_FORMAT
  | typeof DEFAULT_DATE_FORMAT
  | typeof DATETIME_FORMAT_WITH_MILLIS;

export type DatetimeFormatOpts = Partial<FormatOpts<string>>;
export type IsoDatetimeFormatOpts = Partial<FormatOpts<Iso8601FormatType>>;
