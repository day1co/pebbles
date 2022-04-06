import {
  DATE_FORMAT,
  DATETIME_FORMAT,
  LOCAL_DATETIME_FORMAT,
  ONE_DAY_IN_MILLI,
  ONE_DAY_IN_SECOND,
  ONE_HOUR_IN_MILLI,
  ONE_HOUR_IN_SECOND,
  ONE_MINUTE_IN_MILLI,
  ONE_MINUTE_IN_SECOND,
  ONE_SECOND_IN_MILLI,
  TIMESTAMP_FORMAT,
} from './date-util.const';
import type { LocalDateTimeFormatOpts } from './date-util.interface';
import type {
  CalcDatetimeOpts,
  DatePropertyType,
  DatetimeFormatOpts,
  DateType,
  IsoDatetimeFormatOpts,
} from './date-util.type';

export namespace DateUtil {
  export function isValidDate(d: Date): boolean {
    return !isNaN(d.valueOf());
  }

  export function parse(date: DateType): Date {
    if (typeof date === 'string' && date.split(/[ T]/).length === 1) {
      date = date.concat('T00:00:00.000');
    }

    const parsedDate = new Date(date);

    if (!isValidDate(parsedDate)) {
      throw new Error(`Invalid input argument: ${date}`);
    }

    return parsedDate;
  }

  // Todo: format 형식에 제약을 줘야 하지 않을까?
  // Todo: Timezone 파싱?
  export function parseByFormat(str: string, fmt: string): Date {
    if (str.length > fmt.length) {
      throw new Error(`Invalid Arguments: str and fmt are not matched. str: ${str}, fmt: ${fmt}`);
    }

    const patterns = [/YYYY/, /M?M/, /D?D/, /H?H/, /m?m/, /s?s/, /S?S?S/];
    const retDate = new Date(0);
    for (const pattern of patterns) {
      // 각 패턴별로 한번만 파싱 하면 됨
      const match = fmt.match(pattern);
      if (!match) continue;

      const from = match.index ?? 0;
      const end = from + match[0].length;
      const value = from >= str.length || from === end ? 0 : parseInt(str.substring(from, end));
      switch (pattern.toString()) {
        case '/YYYY/':
          retDate.setFullYear(value);
          break;
        case '/M?M/':
          retDate.setMonth(value - 1);
          break;
        case '/D?D/':
          retDate.setDate(value);
          break;
        case '/H?H/':
          retDate.setHours(value);
          break;
        case '/m?m/':
          retDate.setMinutes(value);
          break;
        case '/s?s/':
          retDate.setSeconds(value);
          break;
        case '/S?S?S/':
          // 포맷이 S이고 값이 1인 경우 setMilliseconds(1 * 100)이 되어야 한다
          // 포맷이 SS이고 값이 12인 경우 setMilliseconds(12 * 10)이 되어야 한다
          // 포맷이 SSS이고 값이 123인 경우 setMilliseconds(123 * 1)이 되어야 한다
          retDate.setMilliseconds(value * Math.pow(10, 3 - Math.abs(end - from)));
          break;
      }
    }

    return retDate;
  }

  export function parseTimestamp(str: string): Date {
    return parseByFormat(str, TIMESTAMP_FORMAT);
  }

  export function parseUnixTime(unixTime: number): Date {
    const MAX_SECOND = 8640000000000;
    const MIN_SECOND = -8640000000000;

    if (unixTime > MAX_SECOND || unixTime < MIN_SECOND) {
      throw new Error(`"${unixTime}" exceeds range of possible date value. MAX=${MAX_SECOND} and MIN=${MIN_SECOND}`);
    }

    return parse(unixTime * ONE_SECOND_IN_MILLI);
  }

  export function calcDatetime(date: DateType, opts: Readonly<CalcDatetimeOpts>): Date {
    const parsedDate = parse(date);

    if (opts.year) {
      parsedDate.setFullYear(parsedDate.getFullYear() + opts.year);
    }

    if (opts.month) {
      parsedDate.setMonth(parsedDate.getMonth() + opts.month);
    }

    return new Date(
      parsedDate.getTime() +
        (opts.day ?? 0) * ONE_DAY_IN_MILLI +
        (opts.hour ?? 0) * ONE_HOUR_IN_MILLI +
        (opts.minute ?? 0) * ONE_MINUTE_IN_MILLI +
        (opts.second ?? 0) * ONE_SECOND_IN_MILLI
    );
  }

  export function startOf(date: DateType, property: DatePropertyType): Date {
    const parsedDate = parse(date);
    const result = new Date(parsedDate.getFullYear(), 0, 1, 0, 0, 0, 0);

    switch (property) {
      case 'second':
        result.setSeconds(parsedDate.getSeconds());
      case 'minute':
        result.setMinutes(parsedDate.getMinutes());
      case 'hour':
        result.setHours(parsedDate.getHours());
      case 'day':
        result.setDate(parsedDate.getDate());
      case 'month':
        result.setMonth(parsedDate.getMonth());
      case 'year':
        return result;
    }
  }

  /** @deprecated */
  export function beginOfMonth(date: DateType = new Date()): Date {
    return startOf(date, 'month');
  }

  /** @deprecated */
  export function beginOfDay(date: DateType = new Date()): Date {
    return startOf(date, 'day');
  }

  export function endOf(date: DateType, property: DatePropertyType): Date {
    const parsedDate = parse(date);
    const result = new Date(parsedDate.getFullYear(), 11, 31, 23, 59, 59, 999);
    let flag = true;

    switch (property) {
      case 'second':
        result.setSeconds(parsedDate.getSeconds());
      case 'minute':
        result.setMinutes(parsedDate.getMinutes());
      case 'hour':
        result.setHours(parsedDate.getHours());
      case 'day':
        result.setDate(parsedDate.getDate());
        flag = false;
      case 'month':
        if (flag) result.setMonth(parsedDate.getMonth() + 1, 0);
        else result.setMonth(parsedDate.getMonth());
      case 'year':
        return result;
    }
  }

  /** @deprecated */
  export function endOfMonth(date: DateType = new Date()): Date {
    return endOf(date, 'month');
  }

  /** @deprecated */
  export function endOfDay(date: DateType = new Date()): Date {
    return endOf(date, 'day');
  }

  /** @deprecated */
  export function lastDayOfMonth(date: DateType = new Date()): Date {
    return startOf(endOf(date, 'month'), 'day');
  }

  export function isLastDateOfMonth(date: DateType): boolean {
    return calcDatetime(date, { day: 1 }).getDate() === 1;
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

  export function min(first: DateType, ...rest: DateType[]): Date {
    let min = parse(first);

    for (let item of rest) {
      item = parse(item);
      min = item < min ? item : min;
    }
    return min;
  }

  /** @deprecated */
  export function minDate(first: DateType, ...rest: DateType[]): Date {
    return min(first, ...rest);
  }

  export function format(d: Date, opts?: Readonly<DatetimeFormatOpts>): string {
    // format의 기본 기준은 로컬 런타임으로 한다.
    const isUtc = opts?.isUtc ?? true;
    const formatStr = opts?.format ?? DATETIME_FORMAT;
    const dateInfo = isUtc
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

    return formatStr.replace(/(Y{2,4}|M?M|D?D|H?H|m?m|s?s|S?S?S|Z?Z)/g, (match) => {
      switch (match) {
        case 'YYYY':
        case 'YY':
          return String(dateInfo.year % Math.pow(10, match.length)).padStart(match.length, '0');

        case 'MM':
        case 'M':
          return String(dateInfo.month).padStart(match.length, '0');

        case 'DD':
        case 'D':
          return String(dateInfo.date).padStart(match.length, '0');

        case 'HH':
        case 'H':
          return String(dateInfo.hour).padStart(match.length, '0');

        case 'mm':
        case 'm':
          return String(dateInfo.minute).padStart(match.length, '0');

        case 'ss':
        case 's':
          return String(dateInfo.second).padStart(match.length, '0');

        case 'SSS':
        case 'SS':
        case 'S':
          return String(dateInfo.millisecond).padStart(match.length, '0');

        case 'ZZ':
        case 'Z':
          return isUtc ? 'Z' : getTimezoneOffsetString(d, match.length === 1);

        default:
          return match;
      }
    });
  }

  export function formatInIso8601(date: Date, opts: Readonly<IsoDatetimeFormatOpts>): string {
    return format(date, opts);
  }

  export function getDateString(date: Date, isUtc = true): string {
    return format(date, { format: DATE_FORMAT, isUtc });
  }

  export function getDatetimeString(date: Date, isUtc = true): string {
    return isUtc
      ? format(date, { format: DATETIME_FORMAT, isUtc })
      : format(date, { format: LOCAL_DATETIME_FORMAT, isUtc });
  }

  export function getTimestampString(date: Date, isUtc = true): string {
    return format(date, { format: TIMESTAMP_FORMAT, isUtc });
  }

  /** @deprecated */
  export function formatToIsoString(d: Date, opts: Readonly<IsoDatetimeFormatOpts>): string {
    return formatInIso8601(d, opts);
  }

  /** @deprecated */
  export function formatDate(d: Date, isUtc = true): string {
    return getDateString(d, isUtc);
  }

  /** @deprecated */
  export function formatDatetime(d: Date, isUtc = true): string {
    return getDatetimeString(d, isUtc);
  }

  /** @deprecated */
  export function formatTimestamp(d: Date, isUtc = true): string {
    return getTimestampString(d, isUtc);
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

  export function formatLocalTime(d: DateType, opts: Readonly<LocalDateTimeFormatOpts>): string {
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
    return DateUtil.calcDatetime(d, { day: -1 });
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

function getTimezoneOffsetString(date: Date, separatorFlag: boolean): string {
  const sign = date.getTimezoneOffset() > 0 ? '-' : '+';
  const timezoneOffset = Math.abs(date.getTimezoneOffset());
  const offsetMinutes = timezoneOffset % 60;
  const offsetHours = (timezoneOffset - offsetMinutes) / 60;
  const separator = separatorFlag ? ':' : '';
  return `${sign}${String(offsetHours).padStart(2, '0')}${separator}${String(offsetMinutes).padStart(2, '0')}`;
}

function diffMonth(since: Date, until: Date): number {
  const diff = (until.getFullYear() - since.getFullYear()) * 12 + until.getMonth() - since.getMonth();
  const tempDate = new Date(since);
  tempDate.setMonth(tempDate.getMonth() + diff);

  /*
    since와 until의 차이나는 month만큼 since 에서 더해준 tempDate
    tempDate가 until보다 더 큰 경우 실제 마지막 한달만큼은 차이가 안나는것이므로 -1
   */
  if (tempDate > until) {
    return diff - 1;
  }

  return diff;
}
