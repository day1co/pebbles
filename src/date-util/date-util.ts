import { LoggerFactory } from '../logger';
const logger = LoggerFactory.getLogger('common-util:date-util');

import type { CalcDatetimeOpts } from './date-util.interface';
import type { DateType } from './date-util.type';

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
}
