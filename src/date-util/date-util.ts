import type { CalcDatetimeOpts, DateFormatOpts } from './date-util.interface';
import type { DateType, DatePropertyType, ISO8601FormatType } from './date-util.type';
import { LoggerFactory } from '../logger';

const ONE_SECOND = 1000;
const ONE_DAY_IN_SECOND = 60 * 60 * 24;
const ONE_HOUR_IN_SECOND = 60 * 60;
const ONE_MINUTE_IN_SECOND = 60;

const DEFAULT_UTC_DATE_FORMAT = 'YYYY-MM-DDTHH:mm:ssZ';
const DEFAULT_LOCALE_DATE_FORMAT = 'YYYY-MM-DDTHH:mm:ss[Z]';
const DEFAULT_LOCALE_TIMEZONE_FORMAT = '[Z]';

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
      logger.error('calcDatetime error: %s, %s, %o', err, d, opts);
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
    return new Date(parse(d).getTime() + offsetMinute * ONE_SECOND * ONE_MINUTE_IN_SECOND);
  }

  export function format(d: Date, opts?: DateFormatOpts): string {
    // format의 기본 기준은 로컬 런타임으로 한다.
    const isUTC = opts?.isUTC ?? false;
    let formatTarget = opts?.format ? opts.format : isUTC ? DEFAULT_UTC_DATE_FORMAT : DEFAULT_LOCALE_DATE_FORMAT;

    const dateInfo = isUTC
      ? {
          year: d.getUTCFullYear(),
          month: d.getUTCMonth() + 1,
          date: d.getUTCDate(),
          hour: d.getUTCHours(),
          minute: d.getUTCMinutes(),
          second: d.getUTCSeconds(),
          millisecond: d.getUTCMilliseconds(),
        }
      : {
          year: d.getFullYear(),
          month: d.getMonth() + 1,
          date: d.getDate(),
          hour: d.getHours(),
          minute: d.getMinutes(),
          second: d.getSeconds(),
          millisecond: d.getMilliseconds(),
        };

    if (formatTarget === DEFAULT_LOCALE_DATE_FORMAT) {
      formatTarget = formatTarget.replace(DEFAULT_LOCALE_TIMEZONE_FORMAT, getLocaleTimezoneOffset(d));
    }

    const FORMAT_RULE_REGEXP = /[yYmMdDhHsS]{1,4}/g;
    formatTarget = formatTarget.replace(FORMAT_RULE_REGEXP, (match) => {
      switch (match) {
        case 'YYYY':
          return String(dateInfo.year);
        case 'YY':
          return String(dateInfo.year).padStart(2, '0');

        case 'MM':
          return String(dateInfo.month).padStart(2, '0');
        case 'M':
          return String(dateInfo.month);

        case 'DD':
          return String(dateInfo.date).padStart(2, '0');
        case 'D':
          return String(dateInfo.date);

        case 'HH':
          return String(dateInfo.hour).padStart(2, '0');
        case 'H':
          return String(dateInfo.hour);

        case 'mm':
          return String(dateInfo.minute).padStart(2, '0');
        case 'm':
          return String(dateInfo.minute);

        case 'ss':
          return String(dateInfo.second).padStart(2, '0');
        case 's':
          return String(dateInfo.second);

        case 'SSS':
          return String(dateInfo.millisecond).padStart(3, '0');
        case 'SS':
          return String(dateInfo.millisecond).padStart(2, '0');
        case 'S':
          return String(dateInfo.millisecond);

        default:
          return match;
      }
    });
    if (FORMAT_RULE_REGEXP.test(formatTarget)) {
      throw new Error(`Invalid format: ${formatTarget}`);
    }
    return formatTarget;
  }

  export function formatToISOString(
    d: Date,
    opts: Omit<DateFormatOpts, 'format'> & { format: ISO8601FormatType }
  ): string {
    const ISOFormat = opts.format;
    const isUTC = opts.isUTC ?? false;
    return format(d, { format: ISOFormat, isUTC: isUTC });
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

function getLocaleTimezoneOffset(d: Date): string {
  const localeTimezoneOffset = Math.abs(d.getTimezoneOffset());
  const sign = localeTimezoneOffset < 0 ? '-' : '+';

  const offsetHours = String(Math.floor(localeTimezoneOffset / 60)).padStart(2, '0');
  const offsetMinutes = String(Math.floor(localeTimezoneOffset % 60)).padStart(2, '0');
  return `${sign}${offsetHours}:${offsetMinutes}`;
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
