import { LoggerFactory } from '../logger';
const logger = LoggerFactory.getLogger('common-util:date-util');

import type { CalcDatetimeOpts } from './date-util.interface';
import type { DateType } from './date-util.type';

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

  export function beginOfMonth(date: string | Date = new Date()): Date {
    date = toDate(date);
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }

  export function endOfMonth(date: string | Date = new Date()): Date {
    date = toDate(date);
    return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59);
  }

  export function lastDayOfMonth(date: string | Date = new Date()): Date {
    date = toDate(date);
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
  }

  export function isValidDate(d: Date): boolean {
    return !isNaN(d.valueOf());
  }

  export function toDate(d: DateType): Date {
    const originalD = d;
    if (typeof d !== 'object') {
      d = new Date(d);
    }

    if (!isValidDate(d)) {
      throw new Error(`Invalid Date: ${originalD.toString()}`);
    }

    return d;
  }

  export function diff(since: string, until: string, type: DiffType): number {
    if (isNaN(Date.parse(since))) {
      throw new Error(`BAD PARAM since > ${since}`);
    }

    if (isNaN(Date.parse(until))) {
      throw new Error(`BAD PARAM until > ${until}`);
    }

    const sinceDate = new Date(since);
    const untilDate = new Date(until);

    const ONE_SECOND = 1000;
    const diffSeconds = (untilDate.getTime() - sinceDate.getTime()) / ONE_SECOND;

    // move to policy
    const ONE_YEAR_IN_SECOND = 60 * 60 * 24 * 365;
    const ONE_MONTH_IN_SECOND = 60 * 60 * 24 * 30;
    const ONE_DAY_IN_SECOND = 60 * 60 * 24;

    const ONE_HOUR_IN_SECOND = 60 * 60;
    const ONE_MINUTE_IN_SECOND = 60;

    switch (type) {
      case 'year':
        return Math.floor(diffSeconds / ONE_YEAR_IN_SECOND);
      case 'month':
        return Math.floor(diffSeconds / ONE_MONTH_IN_SECOND);
      case 'day':
        return Math.floor(diffSeconds / ONE_DAY_IN_SECOND);

      case 'hour':
        return Math.floor(diffSeconds / ONE_HOUR_IN_SECOND);
      case 'minute':
        return Math.floor(diffSeconds / ONE_MINUTE_IN_SECOND);
      case 'second':
        return Math.floor(diffSeconds);

      default:
        const err: never = type;
        return err;
    }
  }
}
