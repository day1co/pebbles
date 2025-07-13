import { LoggerFactory } from '../logger';
import { DatePropertyType, DateType, TimeZoneType } from './date-util-base.type';
import {
  ADULT_AGE_DEFAULT,
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
import type { TimeAnnotationSet } from './date-util.interface';
import type { CalcDatetimeOpts, DatetimeFormatOpts, IsoDatetimeFormatOpts } from './date-util.type';

const timeZoneMap: Record<TimeZoneType, number> = {
  'Asia/Seoul': 540,
  'Asia/Tokyo': 540,
  PST8PDT: -480,
  UTC: 0,
};
const logger = LoggerFactory.getLogger('pebbles:date-util');

export function isValidDate(d: Date): boolean {
  return !isNaN(d.valueOf());
}

export function parseDate(date: DateType): Date {
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
export function parseByFormatDate(str: string, fmt: string): Date {
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
  return parseByFormatDate(str, TIMESTAMP_FORMAT);
}

export function parseUnixTime(unixTime: number): Date {
  const MAX_SECOND = 8640000000000;
  const MIN_SECOND = -8640000000000;

  if (unixTime > MAX_SECOND || unixTime < MIN_SECOND) {
    throw new Error(
      `"${unixTime}" exceeds range of possible date value. MAX=${MAX_SECOND} and MIN=${MIN_SECOND}`
    );
  }

  return parseDate(unixTime * ONE_SECOND_IN_MILLI);
}

export function calcDatetime(date: DateType, opts: Readonly<CalcDatetimeOpts>): Date {
  const parsedDate = parseDate(date);

  if (opts.year) {
    parsedDate.setFullYear(parsedDate.getFullYear() + opts.year);
  }

  if (opts.month) {
    parsedDate.setMonth(parsedDate.getMonth() + opts.month);
  }

  if (opts.week) {
    parsedDate.setDate(parsedDate.getDate() + 7 * opts.week);
  }

  return new Date(
    parsedDate.getTime() +
      (opts.day ?? 0) * ONE_DAY_IN_MILLI +
      (opts.hour ?? 0) * ONE_HOUR_IN_MILLI +
      (opts.minute ?? 0) * ONE_MINUTE_IN_MILLI +
      (opts.second ?? 0) * ONE_SECOND_IN_MILLI
  );
}

export function startOfDate(date: DateType, property: DatePropertyType): Date {
  const parsedDate = parseDate(date);
  const result = new Date(parsedDate.getFullYear(), 0, 1, 0, 0, 0, 0);

  switch (property) {
    case 'second':
      result.setSeconds(parsedDate.getSeconds());
    // falls through
    case 'minute':
      result.setMinutes(parsedDate.getMinutes());
    // falls through
    case 'hour':
      result.setHours(parsedDate.getHours());
    // falls through
    case 'day':
      result.setDate(parsedDate.getDate());
    // falls through
    case 'month':
      result.setMonth(parsedDate.getMonth());
    // falls through
    case 'year':
      return result;
  }
}

export function startOfByTimezone({
  date,
  property,
  timezone,
}: {
  date: DateType;
  property: DatePropertyType;
  timezone: TimeZoneType;
}): Date {
  const parsedDate = parseDate(date);
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: timezone,
  };

  const formatter = new Intl.DateTimeFormat('en-US', options);
  const parts = formatter.formatToParts(parsedDate);

  const dateMap: Map<string, string | undefined> = new Map([
    ['year', undefined],
    ['month', undefined],
    ['day', undefined],
    ['hour', undefined],
    ['minute', undefined],
    ['second', undefined],
  ]);

  switch (property) {
    case 'year':
      dateMap.set('month', '01');
    // falls through
    case 'month':
      dateMap.set('day', '01');
    // falls through
    case 'day':
      dateMap.set('hour', '00');
    // falls through
    case 'hour':
      dateMap.set('minute', '00');
    // falls through
    case 'minute':
      dateMap.set('second', '00');
      break;
  }

  parts.forEach(({ type, value }) => {
    const dateMapValue = dateMap.get(type);
    if (!dateMapValue) {
      dateMap.set(type, value);
    }
  });

  if (dateMap.get('hour') === '24') {
    dateMap.set('hour', '00');
  }

  const isoString = `${dateMap.get('year')}-${dateMap.get('month')}-${dateMap.get(
    'day'
  )}T${dateMap.get('hour')}:${dateMap.get('minute')}:${dateMap.get('second')}`;
  const timezoneOffsetString = getTimezoneOffsetString(timezone, false);
  return new Date(`${isoString}${timezoneOffsetString}`);
}

export function endOfByTimezone({
  date,
  property,
  timezone,
}: {
  date: DateType;
  property: DatePropertyType;
  timezone: TimeZoneType;
}): Date {
  const parsedDate = new Date(date);

  switch (property) {
    case 'year':
      parsedDate.setUTCFullYear(parsedDate.getUTCFullYear() + 1);
      break;
    case 'month':
      parsedDate.setUTCHours(
        parsedDate.getUTCHours() + getTimezoneOffsetInHours(parsedDate, timezone)
      );
      parsedDate.setUTCMonth(parsedDate.getUTCMonth() + 1, 1);
      break;
    case 'day':
      parsedDate.setUTCDate(parsedDate.getUTCDate() + 1);
      break;
    case 'hour':
      parsedDate.setUTCHours(parsedDate.getUTCHours() + 1);
      break;
    case 'minute':
      parsedDate.setUTCMinutes(parsedDate.getUTCMinutes() + 1);
      break;
  }

  const result = startOfByTimezone({ date: parsedDate, property, timezone });

  return result;
}

export function getTimezoneOffsetInHours(date: Date, timezone: string) {
  const timezoneDate = new Date(date.toLocaleString('en-US', { timeZone: timezone }));
  const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));

  const offset = (timezoneDate.getTime() - utcDate.getTime()) / ONE_HOUR_IN_MILLI;
  return offset;
}

export function isLastDateOfMonth(date: DateType): boolean {
  return calcDatetime(date, { day: 1 }).getDate() === 1;
}

export function diffDate(
  since: DateType,
  until: DateType,
  type: DatePropertyType,
  opts: { ignoreAccuracy: boolean } = { ignoreAccuracy: false }
): number {
  const ignoreAccuracy = opts.ignoreAccuracy;
  const sinceDate = parseDate(since);
  const untilDate = parseDate(until);

  if (untilDate < sinceDate) {
    return -diffDate(until, since, type, { ignoreAccuracy });
  }

  const diffSeconds = (untilDate.getTime() - sinceDate.getTime()) / ONE_SECOND_IN_MILLI;

  let result: number;
  switch (type) {
    case 'year':
      result = diffMonth(sinceDate, untilDate) / 12;
      break;
    case 'month':
      result = diffMonth(sinceDate, untilDate, { ignoreAccuracy });
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

export function minDate(first: DateType, second: DateType, ...rest: DateType[]): Date {
  const parsedFirst = parseDate(first);
  const parsedSecond = parseDate(second);
  let min = parsedFirst <= parsedSecond ? parsedFirst : parsedSecond;

  for (let item of rest) {
    item = parseDate(item);
    min = item < min ? item : min;
  }

  return min;
}

export function formatDate(d: Date, opts?: Readonly<DatetimeFormatOpts>): string {
  const { isUtc = true, locale = 'ko' } = opts ?? {};
  const formatStr = opts?.format ?? (isUtc ? DATETIME_FORMAT : LOCAL_DATETIME_FORMAT);
  const timeZone = isUtc ? 'UTC' : opts?.timeZone ?? 'UTC';
  const year = Number(new Intl.DateTimeFormat('en', { year: 'numeric', timeZone }).format(d));
  const month = new Intl.DateTimeFormat('en', { month: 'numeric', timeZone }).format(d);
  const date = new Intl.DateTimeFormat('en', { day: 'numeric', timeZone }).format(d);
  const hour = Number(
    new Intl.DateTimeFormat('en', { hour: 'numeric', hourCycle: 'h23', timeZone }).format(d)
  );
  const minute = new Intl.DateTimeFormat('en', { minute: 'numeric', timeZone }).format(d);
  const second = new Intl.DateTimeFormat('en', { second: 'numeric', timeZone }).format(d);
  const millisecond = String(d.getMilliseconds());

  return formatStr.replace(/(Y{2,4}|M?M|D?D|H?H|m?m|s?s|S?S?S|Z?Z|ddd?d)/g, match => {
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
      case 'dddd': {
        const weekday = match.length === 3 ? 'short' : 'long';
        return new Intl.DateTimeFormat(locale, { weekday, timeZone }).format(d);
      }

      default:
        return match;
    }
  });
}

/**
 *
 * @description It converts `date` in `opts.format` if it's given. Otherwise the default format would be `YYYY-MM-DDTHH:mm:ssZ`.
 * - Other format options can be `YYYY-MM-DD` or `YYYY-MM-DDTHH:mm:ss.SSSZ`.
 */
export function formatInIso8601(date: Date, opts?: Readonly<IsoDatetimeFormatOpts>): string {
  const formatOpts: IsoDatetimeFormatOpts = opts ?? {};
  formatOpts.format = opts?.format ?? DATETIME_FORMAT;
  return formatDate(date, formatOpts);
}

/**
 *
 * @description It converts `date` in `YYYY-MM-DD` format.
 */
export function getDateString(
  date: Date,
  isUtc = true,
  timeZone: TimeZoneType = 'Asia/Seoul'
): string {
  return formatDate(date, { format: DATE_FORMAT, isUtc, timeZone });
}

/**
 *
 * @description It converts `date` in `YYYY-MM-DDTHH:mm:ssZ` format if isUtc is true by default.
 * Otherwise the format would be `YYYY-MM-DD HH:mm:ss`.
 */
export function getDatetimeString(
  date: Date,
  isUtc = true,
  timeZone: TimeZoneType = 'Asia/Seoul'
): string {
  return formatDate(date, { isUtc, timeZone });
}

/**
 *
 * @description It converts `date` in `YYYYMMDDHHmmssSSS` format.
 */
export function getTimestampString(
  date: Date,
  isUtc = true,
  timeZone: TimeZoneType = 'Asia/Seoul'
): string {
  return formatDate(date, { format: TIMESTAMP_FORMAT, isUtc, timeZone });
}

/**
 *
 * @description It converts `totalSeconds` in `hh:mm:ss` format.
 */
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

export function durationTo(duration: string, unitType: DatePropertyType = 'second'): number {
  if (unitType !== 'second') {
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
      logger.warn(`durationTo(): invalid timeUnit : ${duration}`);
      return 0;
    }
    if (i === 1 && +timeUnit > 59) {
      logger.warn(`durationTo(): minute is not valid : ${duration}`);
      return 0;
    }
    if (i === 2 && +timeUnit > 59) {
      logger.warn(`durationTo(): minute is not valid : ${duration}`);
      return 0;
    }
  }

  if (!durationArray.length) return 0;

  const hour = durationArray[0] ? +durationArray[0] * 3600 : 0;
  const min = durationArray[1] ? +durationArray[1] * 60 : 0;
  const second = durationArray[2] ? +durationArray[2] : 0;

  return hour + min + second;
}

// TODO: Use LocaleType for `locale` when adding other locales.
export function fromNow(date: DateType, locale: 'ko' = 'ko') {
  const TIME_ANNOTATION_SET: Record<'ko', TimeAnnotationSet> = {
    ko: {
      SSS: '금방',
      s: '초',
      m: '분',
      H: '시간',
      D: '일',
      M: '달',
      Y: '년',
    },
  };
  const localeAnnotation = TIME_ANNOTATION_SET[locale];
  const until = parseDate(date);
  const now = new Date();

  const yearDiff = Math.abs(diffDate(now, until, 'year'));
  if (yearDiff !== 0) {
    return `${yearDiff}${localeAnnotation.Y}`;
  }
  const monthDiff = Math.abs(diffDate(now, until, 'month', { ignoreAccuracy: true }));
  if (monthDiff !== 0) {
    return `${monthDiff}${localeAnnotation.M}`;
  }
  const dayDiff = Math.abs(diffDate(now, until, 'day'));
  if (dayDiff !== 0) {
    return `${dayDiff}${localeAnnotation.D}`;
  }
  const hourDiff = Math.abs(diffDate(now, until, 'hour'));
  if (hourDiff !== 0) {
    return `${hourDiff}${localeAnnotation.H}`;
  }
  const minuteDiff = Math.abs(diffDate(now, until, 'minute'));
  if (minuteDiff !== 0) {
    return `${minuteDiff}${localeAnnotation.m}`;
  }
  const secondDiff = Math.abs(diffDate(now, until, 'second'));
  if (secondDiff !== 0) {
    return `${secondDiff}${localeAnnotation.s}`;
  }
  return localeAnnotation.SSS;
}

export function isAdult(birth: DateType, timeZone: TimeZoneType): boolean {
  const now = new Date();
  const timeZoneNow = formatDate(now, { format: 'YYYY-MM-DD', isUtc: false, timeZone });
  const age = diffDate(birth, timeZoneNow, 'year');

  return age >= ADULT_AGE_DEFAULT;
}

export function subtractOneDayIfLocalTimeIsMidnight(d: Date, timeZone: string): Date {
  const isMidnight =
    new Intl.DateTimeFormat('en-US', { hour: '2-digit', hour12: false, timeZone: timeZone }).format(
      d
    ) === '24';
  if (isMidnight) {
    return calcDatetime(d, { day: -1 });
  }
  return d;
}

export function format12HourInLocale(str: string, locale: string): string {
  const INTL_MIDNIGHT_OR_NOON_KOR_REGEXP = /(24시|12시)/g;

  // TODO: 별도 enum으로 관리?
  const ReplaceMap: { [key: string]: string } = {
    '24시': '자정',
    '12시': '정오',
  };

  switch (locale) {
    case 'ko-KR':
    case 'ko':
      return str.replace(INTL_MIDNIGHT_OR_NOON_KOR_REGEXP, match => ReplaceMap[match]);
    default:
      return str;
  }
}

export function getTimezoneOffsetString(timeZone: TimeZoneType, separatorFlag: boolean): string {
  const separator = separatorFlag ? ':' : '';
  const sign = timeZoneMap[timeZone] >= 0 ? '+' : '-';
  const offsetMinutes = timeZoneMap[timeZone] % 60;
  const offsetHours = (timeZoneMap[timeZone] - offsetMinutes) / 60;
  const offsetHoursString = String(Math.abs(offsetHours)).padStart(2, '0');
  const offsetMinutesString = String(Math.abs(offsetMinutes)).padStart(2, '0');
  return `${sign}${offsetHoursString}${separator}${offsetMinutesString}`;
}

export function diffMonth(
  since: Date,
  until: Date,
  opts: { ignoreAccuracy: boolean } = { ignoreAccuracy: false }
): number {
  const diff =
    (until.getFullYear() - since.getFullYear()) * 12 + until.getMonth() - since.getMonth();
  const tempDate = new Date(since);
  tempDate.setMonth(tempDate.getMonth() + diff);

  // Execute humanized vague calcuation only when diff is not 1.
  const shouldHumanize = opts.ignoreAccuracy && diff !== 1;

  /*
    since와 until의 차이나는 month만큼 since 에서 더해준 tempDate
    tempDate가 until보다 더 큰 경우 실제 마지막 한달만큼은 차이가 안나는것이므로 -1
    Ignore this logic if `shouldHumanize` is true
   */
  if (tempDate > until && !shouldHumanize) {
    return diff - 1;
  }

  return diff;
}
