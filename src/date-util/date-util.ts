import type { DateFormatOpts, ISODateFormatOpts, LocalDateTimeFormatOpts } from './date-util.interface';
import type { CalcDatetimeOpts, DateType, DatePropertyType } from './date-util.type';

const DEFAULT_UTC_DATE_FORMAT = 'YYYY-MM-DDTHH:mm:ssZ';
const DEFAULT_LOCALE_DATE_FORMAT = 'YYYY-MM-DDTHH:mm:ss[Z]';
const DEFAULT_LOCALE_TIMEZONE_FORMAT = '[Z]';
const DATE_FORMAT = 'YYYY-MM-DD';
const DATETIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';
const TIMESTAMP_FORMAT = 'YYYYMMDDHHmmssSSS';

export namespace DateUtil {
  export const ONE_SECOND_IN_MILLI = 1000;
  export const ONE_MINUTE_IN_SECOND = 60;
  export const ONE_HOUR_IN_SECOND = 60 * ONE_MINUTE_IN_SECOND;
  export const ONE_DAY_IN_SECOND = 24 * ONE_HOUR_IN_SECOND;
  export const ONE_MINUTE_IN_MILLI = ONE_MINUTE_IN_SECOND * ONE_SECOND_IN_MILLI;
  export const ONE_HOUR_IN_MILLI = ONE_HOUR_IN_SECOND * ONE_SECOND_IN_MILLI;
  export const ONE_DAY_IN_MILLI = ONE_DAY_IN_SECOND * ONE_SECOND_IN_MILLI;

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
          retDate.setMilliseconds(value);
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
      throw new Error(`"${unixTime}" exceeds range of possible date value`);
    }

    return parse(unixTime * ONE_SECOND_IN_MILLI);
  }

  export function calcDatetime(date: DateType, opts: Readonly<CalcDatetimeOpts>): Date {
    const oarsedDate = parse(date);

    if (opts.year) {
      oarsedDate.setFullYear(oarsedDate.getFullYear() + opts.year);
    }

    if (opts.month) {
      oarsedDate.setMonth(oarsedDate.getMonth() + opts.month);
    }

    return new Date(
      oarsedDate.getTime() +
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

  export function minDate(first: DateType, ...rest: DateType[]): Date {
    let min = parse(first);

    for (let item of rest) {
      item = parse(item);
      min = item < min ? item : min;
    }
    return min;
  }

  export function format(d: Date, opts?: Readonly<DateFormatOpts>): string {
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

  export function formatToISOString(d: Date, opts: Readonly<ISODateFormatOpts>): string {
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
