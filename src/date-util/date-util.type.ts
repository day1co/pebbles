import { DatetimeProperties, FormatOpts } from './date-util.interface';
import { Iso8601FormatType } from './date-util-base.type';

export type CalcDatetimeOpts = Partial<DatetimeProperties>;
export type DatetimeFormatOpts = Partial<FormatOpts<string>>;
export type IsoDatetimeFormatOpts = Partial<FormatOpts<Iso8601FormatType>>;
export type DateUnitType = 'seconds' | 'minutes' | 'hours';
