import type {
  CalcDatetimeOpts,
  DateFormatOpts,
  ISODateFormatOpts,
  LocalDateTimeFormatOpts,
} from './date-util.interface';
import type { DateType, DatePropertyType } from './date-util.type';

const ONE_SECOND_IN_MILLI = 1000;
const ONE_MINUTE_IN_SECOND = 60;
const ONE_HOUR_IN_SECOND = 60 * ONE_MINUTE_IN_SECOND;
const ONE_DAY_IN_SECOND = 24 * ONE_HOUR_IN_SECOND;
const ONE_MINUTE_IN_MILLI = ONE_MINUTE_IN_SECOND * ONE_SECOND_IN_MILLI;
const ONE_HOUR_IN_MILLI = ONE_HOUR_IN_SECOND * ONE_SECOND_IN_MILLI;
const ONE_DAY_IN_MILLI = ONE_DAY_IN_SECOND * ONE_SECOND_IN_MILLI;

const DEFAULT_UTC_DATE_FORMAT = 'YYYY-MM-DDTHH:mm:ssZ';
const DEFAULT_LOCALE_DATE_FORMAT = 'YYYY-MM-DDTHH:mm:ss[Z]';
const DEFAULT_LOCALE_TIMEZONE_FORMAT = '[Z]';
const DATE_FORMAT = 'YYYY-MM-DD';
const DATETIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';
const TIMESTAMP_FORMAT = 'YYYYMMDDHHmmssSSS';

export namespace DateUtil {
  export function isValidDate(d: Date): boolean {
    return !isNaN(d.valueOf());
  }

  export function parse(d: DateType): Date {
    const parsedDate = new Date(d);

    if (!isValidDate(parsedDate)) {
      throw new Error(`Invalid Date: ${d.toString()}`);
    }

    return parsedDate;
  }

  export function calcDatetime(d: DateType, opts: CalcDatetimeOpts): Date {
    const date = parse(d);

    if (opts.year) {
      date.setFullYear(date.getFullYear() + opts.year);
    }

    if (opts.month) {
      date.setMonth(date.getMonth() + opts.month);
    }

    const result = new Date(
      date.getTime() +
        (opts.date ?? 0) * ONE_DAY_IN_MILLI +
        (opts.hour ?? 0) * ONE_HOUR_IN_MILLI +
        (opts.minute ?? 0) * ONE_MINUTE_IN_MILLI +
        (opts.second ?? 0) * ONE_SECOND_IN_MILLI
    );

    return result;
  }

  export function beginOfDay(date: DateType = new Date()): Date {
    date = parse(date);
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  export function endOfDay(date: DateType = new Date()): Date {
    date = parse(date);
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);
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

  export function isLastDateOfMonth(date: DateType): boolean {
    date = parse(date);
    return new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1).getDate() === 1;
  }

  export function diff(since: DateType, until: DateType, type: DatePropertyType): number {
    const sinceDate = parse(since);
    const untilDate = parse(until);

    if (untilDate < sinceDate) {
      return -diff(until, since, type);
    }

    const diffSeconds = (untilDate.getTime() - sinceDate.getTime()) / ONE_SECOND_IN_MILLI;

    let result: number;
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
      default:
        // second
        result = diffSeconds;
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
      const from = match.index ? match.index : 0;
      const end = from + match[0].length;
      const val = str.substring(from, end);
      return val.length > 0 ? val : '0';
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
    return parseByFormat(str, TIMESTAMP_FORMAT);
  }

  export function parseUnixTime(unixTime: string | number): Date {
    const MAX_SECOND = 8640000000000;
    const MIN_SECOND = -8640000000000;

    if (typeof unixTime === 'string') {
      unixTime = parseInt(unixTime);
    }
    if (unixTime > MAX_SECOND || unixTime < MIN_SECOND) {
      throw new Error(`"${unixTime}" exceeds range of possible date value`);
    }
    unixTime *= ONE_SECOND_IN_MILLI;
    return parse(unixTime);
  }

  export function setUTCOffset(d: DateType, offsetMinute: number): Date {
    return new Date(parse(d).getTime() + offsetMinute * ONE_SECOND_IN_MILLI * ONE_MINUTE_IN_SECOND);
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

    const FORMAT_RULE_REGEXP = /(Y{2,4}|M?M|D?D|H?H|m?m|s?s|S?S?S)/g;
    const FORMAT_VERIFICATION_REGEXP = /(Y{2,4}|M?M|D?D|H?H|S?S?S)/gi;
    formatTarget = formatTarget.replace(FORMAT_RULE_REGEXP, (match) => {
      switch (match) {
        case 'YYYY':
          return String(dateInfo.year);
        case 'YY':
          return String(dateInfo.year % 100).padStart(2, '0');

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
    if (FORMAT_VERIFICATION_REGEXP.test(formatTarget)) {
      throw new Error(`Invalid format: ${formatTarget}`);
    }
    return formatTarget;
  }

  export function formatToISOString(d: Date, opts: ISODateFormatOpts): string {
    const ISOFormat = opts.format;
    const isUTC = opts.isUTC ?? false;
    return format(d, { format: ISOFormat, isUTC: isUTC });
  }

  export function formatDate(d: Date, isUTC = false): string {
    return format(d, { format: DATE_FORMAT, isUTC });
  }
  export function formatDatetime(d: Date, isUTC = false): string {
    return format(d, { format: DATETIME_FORMAT, isUTC });
  }
  export function formatTimestamp(d: Date, isUTC = false): string {
    return format(d, { format: TIMESTAMP_FORMAT, isUTC });
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

  export function formatLocalTime(d: DateType, opts: LocalDateTimeFormatOpts): string {
    d = subtractOneDayIfLocalTimeIsMidnight(parse(d), opts.timeZone);

    const options: Intl.DateTimeFormatOptions = {};
    switch (opts.formatStyle) {
      case '2-digit':
        options.year = opts.withYear ? '2-digit' : undefined;
        options.month = '2-digit';
        options.day = '2-digit';
        options.hour = '2-digit';
        options.weekday = 'short';
        options.hour12 = false;
        options.timeZone = opts.timeZone;
        break;

      case 'long':
        options.year = opts.withYear ? 'numeric' : undefined;
        options.month = 'long';
        options.day = 'numeric';
        options.hour = '2-digit';
        options.weekday = 'long';
        options.hour12 = false;
        options.timeZone = opts.timeZone;
        break;
    }

    const formatResult = new Intl.DateTimeFormat(opts.locale, options)
      .format(d)
      .replace(/[.]\s(?=.*[.])|[.]/g, (match) => {
        switch (match) {
          case '. ':
            return '/';
          case '.':
            return '';
          default:
            return match;
        }
      });
    return format12HourInLocale(formatResult, opts.locale);
  }
}

function subtractOneDayIfLocalTimeIsMidnight(d: Date, timeZone: string): Date {
  const isMidnight =
    new Intl.DateTimeFormat('en-US', { hour: '2-digit', hour12: false, timeZone: timeZone }).format(d) === '24';
  if (isMidnight) {
    return DateUtil.calcDatetime(d, { date: -1 });
  }
  return d;
}

function format12HourInLocale(str: string, locale: string): string {
  const INTL_MIDNIGHT_OR_NOON_KOR_REGEXP = /(24시|12시)/g;

  // TODO: 별도 enum으로 관리?
  const ReplaceMap: { [key: string]: string } = {
    '24시': '자정',
    '12시': '정오',
  };

  switch (locale) {
    case 'ko-KR':
    case 'ko':
      return str.replace(INTL_MIDNIGHT_OR_NOON_KOR_REGEXP, (match) => ReplaceMap[match]);
    default:
      return str;
  }
}

function getLocaleTimezoneOffset(d: Date): string {
  const localeTimezoneOffset = Math.abs(d.getTimezoneOffset());
  const sign = localeTimezoneOffset < 0 ? '-' : '+';

  const offsetHours = String(Math.floor(localeTimezoneOffset / 60)).padStart(2, '0');
  const offsetMinutes = String(Math.floor(localeTimezoneOffset % 60)).padStart(2, '0');
  return `${sign}${offsetHours}:${offsetMinutes}`;
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
