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
import type { CalcDatetimeOpts, DatetimeFormatOpts, IsoDatetimeFormatOpts, DateUnitType } from './date-util.type';
import { DatePropertyType, DateType, TimeZoneType } from './date-util-base.type';
import { LoggerFactory } from '../logger';

const timeZoneMap: Record<TimeZoneType, number> = { 'Asia/Seoul': 540, 'Asia/Tokyo': 540, PST: -480, UTC: 0 };
const logger = LoggerFactory.getLogger('pebbles:date-util');

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
    const retDate = new Date(0, 0, 1);
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
          if (value > 12) throw new Error('Invalid month value');
          retDate.setMonth(value - 1);
          break;
        case '/D?D/':
          if (value > 31) throw new Error('Invalid date value');
          retDate.setDate(value);
          break;
        case '/H?H/':
          if (value >= 24) throw new Error('Invalid hour value');
          retDate.setHours(value);
          break;
        case '/m?m/':
          if (value >= 60) throw new Error('Invalid minute value');
          retDate.setMinutes(value);
          break;
        case '/s?s/':
          if (value >= 60) throw new Error('Invalid second value');
          retDate.setSeconds(value);
          break;
        case '/S?S?S/':
          // 포맷이 S, 값이 1인 경우 setMilliseconds(1 * 100)이 되어야 한다
          // 포맷이 SS, 값이 12인 경우 setMilliseconds(12 * 10)이 되어야 한다
          // 포맷이 SSS, 값이 123인 경우 setMilliseconds(123 * 1)이 되어야 한다
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

  export function min(first: DateType, second: DateType, ...rest: DateType[]): Date {
    const parsedFirst = parse(first);
    const parsedSecond = parse(second);
    let min = parsedFirst <= parsedSecond ? parsedFirst : parsedSecond;

    for (let item of rest) {
      item = parse(item);
      min = item < min ? item : min;
    }

    return min;
  }

  /** @deprecated */
  export function minDate(first: DateType, second: DateType, ...rest: DateType[]): Date {
    return min(first, second, ...rest);
  }

  export function format(d: Date, opts?: Readonly<DatetimeFormatOpts>): string {
    const { isUtc = true, locale = 'ko' } = opts ?? {};
    const formatStr = opts?.format ?? (isUtc ? DATETIME_FORMAT : LOCAL_DATETIME_FORMAT);
    const timeZone = isUtc ? 'UTC' : opts?.timeZone ?? 'UTC';
    const year = Number(new Intl.DateTimeFormat('en', { year: 'numeric', timeZone }).format(d));
    const month = new Intl.DateTimeFormat('en', { month: 'numeric', timeZone }).format(d);
    const date = new Intl.DateTimeFormat('en', { day: 'numeric', timeZone }).format(d);
    const hour = Number(new Intl.DateTimeFormat('en', { hour: 'numeric', hourCycle: 'h23', timeZone }).format(d));
    const minute = new Intl.DateTimeFormat('en', { minute: 'numeric', timeZone }).format(d);
    const second = new Intl.DateTimeFormat('en', { second: 'numeric', timeZone }).format(d);
    const millisecond = String(d.getMilliseconds());

    return formatStr.replace(/(Y{2,4}|M?M|D?D|H?H|m?m|s?s|S?S?S|Z?Z|ddd?d)/g, (match) => {
      switch (match) {
        case 'YYYY':
        case 'YY':
          return String(year % Math.pow(10, match.length)).padStart(match.length, '0');

        case 'MM':
        case 'M':
          return month.padStart(match.length, '0');

        case 'DD':
        case 'D':
          return date.padStart(match.length, '0');

        case 'HH':
        case 'H':
          return String(hour).padStart(match.length, '0');

        case 'mm':
        case 'm':
          return minute.padStart(match.length, '0');

        case 'ss':
        case 's':
          return second.padStart(match.length, '0');

        case 'SSS':
        case 'SS':
        case 'S':
          return millisecond.padStart(match.length, '0');

        case 'ZZ':
        case 'Z':
          return isUtc ? 'Z' : getTimezoneOffsetString(timeZone, match.length === 1);

        case 'ddd':
        case 'dddd':
          const weekday = match.length === 3 ? 'short' : 'long';
          return new Intl.DateTimeFormat(locale, { weekday, timeZone }).format(d);

        default:
          return match;
      }
    });
  }

  export function formatInIso8601(date: Date, opts?: Readonly<IsoDatetimeFormatOpts>): string {
    const formatOpts: IsoDatetimeFormatOpts = opts ?? {};
    formatOpts.format = opts?.format ?? DATETIME_FORMAT;
    return format(date, formatOpts);
  }

  export function getDateString(date: Date, isUtc = true, timeZone: TimeZoneType = 'Asia/Seoul'): string {
    return format(date, { format: DATE_FORMAT, isUtc, timeZone });
  }

  export function getDatetimeString(date: Date, isUtc = true, timeZone: TimeZoneType = 'Asia/Seoul'): string {
    return format(date, { isUtc, timeZone });
  }

  export function getTimestampString(date: Date, isUtc = true, timeZone: TimeZoneType = 'Asia/Seoul'): string {
    return format(date, { format: TIMESTAMP_FORMAT, isUtc, timeZone });
  }

  /** @deprecated */
  export function formatToISOString(d: Date, opts: Readonly<IsoDatetimeFormatOpts>): string {
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

  export function getTimeStringFromSeconds(totalSeconds: number): string {
    if (totalSeconds < 0) {
      throw new Error('Invalid number');
    }

    const seconds = totalSeconds % 60;
    const totalMinutes = (totalSeconds - seconds) / 60;
    const minutes = totalMinutes % 60;
    const hh = String((totalMinutes - minutes) / 60).padStart(2, '0');
    const mm = String(minutes).padStart(2, '0');
    const ss = String(seconds).padStart(2, '0');

    return `${hh}:${mm}:${ss}`;
  }

  /** @deprecated */
  export function secondsToTimeFormat(totalSeconds: number): string {
    return getTimeStringFromSeconds(totalSeconds);
  }

  /** @deprecated */
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

  export function durationTo(duration: string, unitType: DateUnitType = 'seconds'): number {
    if (unitType !== 'seconds') {
      throw new Error('Not supported yet');
    }
    const durationArray = duration.split(':');
    if (durationArray.length > 3) {
      logger.warn(`durationTo(): invalid duration format : ${duration}`);
      return 0;
    }
    for (let i = 0; i < durationArray.length; i++) {
      const timeUnit = durationArray[i];
      if (isNaN(+timeUnit) || +timeUnit < 0) {
        logger.warn(`durationTo(): invalid timeUnit : ${timeUnit}`);
        return 0;
      }
      if (i === 1 && +timeUnit > 59) {
        logger.warn(`durationTo(): minute is not valid${timeUnit}`);
        return 0;
      }
      if (i === 2 && +timeUnit > 59) {
        logger.warn(`durationTo(): minute is not valid${timeUnit}`);
        return 0;
      }
    }

    if (!durationArray.length) return 0;

    const hour = durationArray[0] ? +durationArray[0] * 3600 : 0;
    const min = durationArray[1] ? +durationArray[1] * 60 : 0;
    const second = durationArray[2] ? +durationArray[2] : 0;

    return hour + min + second;
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

function getTimezoneOffsetString(timeZone: TimeZoneType, separatorFlag: boolean): string {
  const separator = separatorFlag ? ':' : '';
  const sign = timeZoneMap[timeZone] >= 0 ? '+' : '-';
  const offsetMinutes = timeZoneMap[timeZone] % 60;
  const offsetHours = (timeZoneMap[timeZone] - offsetMinutes) / 60;
  const offsetHoursString = String(Math.abs(offsetHours)).padStart(2, '0');
  const offsetMinutesString = String(Math.abs(offsetMinutes)).padStart(2, '0');
  return `${sign}${offsetHoursString}${separator}${offsetMinutesString}`;
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
