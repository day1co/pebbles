import { LoggerFactory } from '../logger';
const logger = LoggerFactory.getLogger('common-util:date-util');

import { CalcDatetimeOpts } from './date-util.type';

function isValidDate(d: Date): boolean {
  return !isNaN(d.valueOf());
}

function toDate(d: string | Date): Date {
  const originalD = d;
  if (typeof d === 'string') {
    d = new Date(d);
  }

  if (!isValidDate(d)) {
    throw new Error(`Invalid Date: ${originalD.toString()}`);
  }

  return d;
}

export namespace DateUtil {
  export function calcDatetime(str: string, opts: CalcDatetimeOpts): Date {
    try {
      const date = new Date(str);
      if (isNaN(Date.parse(str))) {
        throw new Error(`BAD PARAM > ${str}`);
      }

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
      logger.error('calcDatetime error:', err, str, opts);
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
}
