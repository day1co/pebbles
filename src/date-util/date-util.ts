import { LoggerFactory } from '../logger';
const logger = LoggerFactory.getLogger('common-util:date-util');

import type { CalcDatetimeOpts } from './date-util.interface';
import type { DateType, DatePropertyType } from './date-util.type';

function isValidDate(d: Date): boolean {
  return !isNaN(d.valueOf());
}

function toDate(d: DateType): Date {
  const originalD = d;
  if (!(d instanceof Date)) {
    d = new Date(d);
  }

  if (!isValidDate(d)) {
    throw new Error(`Invalid Date: ${originalD.toString()}`);
  }

  return d;
}

const ONE_SECOND = 1000;
const ONE_DAY_IN_SECOND = 60 * 60 * 24;
const ONE_HOUR_IN_SECOND = 60 * 60;
const ONE_MINUTE_IN_SECOND = 60;

export namespace DateUtil {
  export function calcDatetime(d: DateType, opts: CalcDatetimeOpts): Date {
    try {
      const date = toDate(d);

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
    date = toDate(date);
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }

  export function endOfMonth(date: DateType = new Date()): Date {
    date = toDate(date);
    return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
  }

  export function lastDayOfMonth(date: DateType = new Date()): Date {
    date = toDate(date);
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
  }

  export function diff(since: DateType, until: DateType, type: DatePropertyType): number {
    const sinceDate = toDate(since);
    const untilDate = toDate(until);

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

  /** @private */
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

  export function minDate(first: DateType, ...rest: DateType[]): Date {
    let min = toDate(first);

    for (let item of rest) {
      item = toDate(item);
      min = item < min ? item : min;
    }
    return min;
  }
}
