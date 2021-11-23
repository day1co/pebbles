import type { CalcDatetimeOpts, DateInfo } from './date-util.interface';
import type { DateType, DatePropertyType, ISO8601FormatType } from './date-util.type';
import { LoggerFactory } from '../logger';

const ONE_SECOND = 1000;
const ONE_DAY_IN_SECOND = 60 * 60 * 24;
const ONE_HOUR_IN_SECOND = 60 * 60;
const ONE_MINUTE_IN_SECOND = 60;

const CUSTOM_OFFSET_FORMAT = 'K';
const DEFAULT_DATE_FORMAT = 'YYYY-MM-DDTHH:mm:ss' + CUSTOM_OFFSET_FORMAT;

const logger = LoggerFactory.getLogger('pebbles:date-util');

export namespace DateUtil {
  export function parse(d: DateType): Date {
    const originalD = d;
    if (!(d instanceof Date)) {
      d = new Date(d);
    }

    if (!isValidDate(d)) {
      throw new Error(`Invalid Date: ${originalD.toString()}`);
    }

    return d;
  }

  export function calcDatetime(d: DateType, opts: CalcDatetimeOpts): Date {
    try {
      const date = parse(d);

      if (opts.year) {
        date.setFullYear(date.getFullYear() + opts.year);
      }

      if (opts.month) {
        date.setMonth(date.getMonth() + opts.month);
      }

      if (opts.date) {
        date.setDate(date.getDate() + opts.date);
      }

      if (opts.hour) {
        date.setHours(date.getHours() + opts.hour);
      }

      if (opts.minute) {
        date.setMinutes(date.getMinutes() + opts.minute);
      }

      if (opts.second) {
        date.setSeconds(date.getSeconds() + opts.second);
      }

      return date;
    } catch (err) {
      logger.error('calcDatetime error: %s, %s, %s', err, d, JSON.stringify(opts));
      throw err;
    }
  }

  export function beginOfMonth(date: DateType = new Date()): Date {
    date = parse(date);
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }

  export function endOfMonth(date: DateType = new Date()): Date {
    date = parse(date);
    return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
  }

  export function lastDayOfMonth(date: DateType = new Date()): Date {
    date = parse(date);
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
  }

  export function diff(since: DateType, until: DateType, type: DatePropertyType): number {
    const sinceDate = parse(since);
    const untilDate = parse(until);

    if (untilDate < sinceDate) {
      return -diff(until, since, type);
    }

    const diffSeconds = (untilDate.getTime() - sinceDate.getTime()) / ONE_SECOND;

    let result = 0;
    switch (type) {
      case 'year':
        result = diffMonth(sinceDate, untilDate) / 12;
        break;
      case 'month':
        result = diffMonth(sinceDate, untilDate);
        break;
      case 'day':
        result = diffSeconds / ONE_DAY_IN_SECOND;
        break;
      case 'hour':
        result = diffSeconds / ONE_HOUR_IN_SECOND;
        break;
      case 'minute':
        result = diffSeconds / ONE_MINUTE_IN_SECOND;
        break;
      case 'second':
        result = diffSeconds;
        break;
      default:
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const _: never = type;
    }

    return Math.floor(result);
  }

  export function minDate(first: DateType, ...rest: DateType[]): Date {
    let min = parse(first);

    for (let item of rest) {
      item = parse(item);
      min = item < min ? item : min;
    }
    return min;
  }

  export function parseByFormat(str: string, fmt: string): Date {
    if (str.length > fmt.length) {
      throw new Error(`Invalid Arguments: str and fmt are not matched. str: ${str}, fmt: ${fmt}`);
    }

    interface Callback {
      (matched: RegExpMatchArray, date: Date): Date;
    }

    function substrByMatch(match: RegExpMatchArray): string {
      const val = str.substr(<number>match.index, match[0].length);
      if (val.length > 0) {
        return val;
      } else {
        return '0';
      }
    }

    const tokenCallbackMap = new Map<string, Callback>([
      [
        'YYYY',
        (match, date) => {
          date.setFullYear(parseInt(substrByMatch(match)));
          return date;
        },
      ],
      [
        'M?M',
        (match, date) => {
          date.setMonth(parseInt(substrByMatch(match)) - 1);
          return date;
        },
      ],
      [
        'D?D',
        (match, date) => {
          date.setDate(parseInt(substrByMatch(match)));
          return date;
        },
      ],
      [
        'H?H',
        (match, date) => {
          date.setHours(parseInt(substrByMatch(match)));
          return date;
        },
      ],
      [
        'm?m',
        (match, date) => {
          date.setMinutes(parseInt(substrByMatch(match)));
          return date;
        },
      ],
      [
        's?s',
        (match, date) => {
          date.setSeconds(parseInt(substrByMatch(match)));
          return date;
        },
      ],
      [
        'S?S?S',
        (match, date) => {
          date.setMilliseconds(parseInt(substrByMatch(match)));
          return date;
        },
      ],
    ]);

    let retDate = new Date(0);
    for (const [token, callback] of tokenCallbackMap.entries()) {
      const pattern = new RegExp(token, 'g');

      for (const match of fmt.matchAll(pattern)) {
        retDate = callback(match, retDate);
      }
    }

    return retDate;
  }

  export function parseTimestamp(str: string): Date {
    return parseByFormat(str, 'YYYYMMDDHHmmssSSS');
  }

  export function setUTCOffset(d: DateType, offsetMinute: number): Date {
    const UTCDate = new Day1D(getUTCTime(d));

    UTCDate.setTime(UTCDate.getTime() + offsetMinute * ONE_MINUTE_IN_SECOND * ONE_SECOND);
    UTCDate.UTCOffsetMinute = offsetMinute;
    return UTCDate;
  }

  export function format(d: Date | Day1D, format = DEFAULT_DATE_FORMAT): string {
    let formatResult;

    const dateInfo = {
      year: d.getFullYear(),
      month: d.getMonth() + 1,
      date: d.getDate(),
      hour: d.getHours(),
      minute: d.getMinutes(),
      second: d.getSeconds(),
      millisecond: d.getMilliseconds(),
    };

    const dateUTCInfo = {
      year: d.getUTCFullYear(),
      month: d.getUTCMonth() + 1,
      date: d.getUTCDate(),
      hour: d.getUTCHours(),
      minute: d.getUTCMinutes(),
      second: d.getUTCSeconds(),
      millisecond: d.getUTCMilliseconds(),
    };

    if (d instanceof Day1D && d.UTCOffsetMinute) {
      formatResult = replaceDateFormat(format, dateUTCInfo);
      if (format === DEFAULT_DATE_FORMAT) {
        formatResult = formatGMTOffset(formatResult, d.UTCOffsetMinute);
      }
    } else {
      formatResult = replaceDateFormat(format, dateInfo);
      if (format === DEFAULT_DATE_FORMAT) {
        formatResult = formatGMTOffset(formatResult, -d.getTimezoneOffset());
      }
    }
    return formatResult;
  }

  export function formatToISOString(d: Date, ISOFormat: ISO8601FormatType): string {
    return format(d, ISOFormat);
  }

  export function secondsToTimeFormat(seconds: number): string {
    if (seconds < 0) {
      throw new Error('Invalid number');
    }

    const hh = Math.floor(seconds / 3600)
      .toString()
      .padStart(2, '0');
    const mm = Math.floor((seconds % 3600) / 60)
      .toString()
      .padStart(2, '0');
    const ss = (seconds % 60).toString().padStart(2, '0');
    return `${hh}:${mm}:${ss}`;
  }
}

class Day1D extends Date {
  public UTCOffsetMinute: number | undefined;

  constructor(d: DateType) {
    super(d);
  }
}

function getUTCTime(d: DateType): number {
  if (!(d instanceof Date)) {
    d = new Date(d);
  }
  return Date.UTC(
    d.getUTCFullYear(),
    d.getUTCMonth(),
    d.getUTCDate(),
    d.getUTCHours(),
    d.getUTCMinutes(),
    d.getUTCMilliseconds()
  );
}

function replaceDateFormat(format: string, dateInfo: DateInfo) {
  const FORMAT_RULE_REGEXP = /[yYmMdDhHsS]{1,4}/g;

  const formattedDate = format.replace(FORMAT_RULE_REGEXP, (match) => {
    switch (match) {
      case 'YYYY':
        return `${dateInfo.year}`;
      case 'YY':
        return `${dateInfo.year}`.padStart(2, '0');

      case 'MM':
        return `${dateInfo.month}`.padStart(2, '0');
      case 'M':
        return `${dateInfo.month}`;

      case 'DD':
        return `${dateInfo.date}`.padStart(2, '0');
      case 'D':
        return `${dateInfo.date}`;

      case 'HH':
        return `${dateInfo.hour}`.padStart(2, '0');
      case 'H':
        return `${dateInfo.hour}`;

      case 'mm':
        return `${dateInfo.minute}`.padStart(2, '0');
      case 'm':
        return `${dateInfo.minute}`;

      case 'ss':
        return `${dateInfo.second}`.padStart(2, '0');
      case 's':
        return `${dateInfo.second}`;

      case 'SSS':
        return `${dateInfo.millisecond}`.padStart(3, '0');
      case 'SS':
        return `${dateInfo.millisecond}`.padStart(2, '0');
      case 'S':
        return `${dateInfo.millisecond}`;

      default:
        return match;
    }
  });

  if (FORMAT_RULE_REGEXP.test(formattedDate)) {
    throw new Error(`Invalid format: ${formattedDate}`);
  }

  return formattedDate;
}

function formatGMTOffset(d: string, minute: number) {
  const sign = minute < 0 ? '-' : '+';
  const dateInfo = {
    year: 0,
    month: 0,
    date: 0,
    hour: Math.floor(Math.abs(minute) / 60),
    minute: Math.floor(Math.abs(minute) % 60),
    second: 0,
    millisecond: 0,
  };

  return d.replace(CUSTOM_OFFSET_FORMAT, sign + replaceDateFormat('HH:mm', dateInfo));
}

function isValidDate(d: Date): boolean {
  return !isNaN(d.valueOf());
}

function diffMonth(since: Date, until: Date): number {
  const diffYear = until.getFullYear() - since.getFullYear();
  const diffMonth = diffYear * 12 + until.getMonth() - since.getMonth();

  const tempDate = new Date(since);
  tempDate.setMonth(tempDate.getMonth() + diffMonth);

  /*
    since와 until의 차이나는 month만큼 since 에서 더해준 tempDate
    tempDate가 until보다 더 큰 경우 실제 마지막 한달만큼은 차이가 안나는것이므로 -1
   */
  if (tempDate > until) {
    return diffMonth - 1;
  }

  return diffMonth;
}
