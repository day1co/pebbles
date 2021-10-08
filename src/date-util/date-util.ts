import { LoggerFactory } from '../logger';
const logger = LoggerFactory.getLogger('common-util:date-util');

import { CalcDatetimeOpts } from './date-util.type';

export namespace DateUtil {
  const INT_A_DAY_IN_MILLISEC = 86400000;
  const INT_A_SEC_IN_MILLISEC = 1000;

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
    if (typeof date == 'string') {
      date = new Date(date);
    }
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }

  export function endOfMonth(date: string | Date = new Date()): Date {
    if (typeof date == 'string') {
      date = new Date(date);
    }
    return new Date(new Date(date.getFullYear(), date.getMonth() + 1).valueOf() - INT_A_SEC_IN_MILLISEC);
  }

  export function lastDayOfMonth(date: string | Date = new Date()): Date {
    if (typeof date == 'string') {
      date = new Date(date);
    }
    return new Date(new Date(date.getFullYear(), date.getMonth() + 1).valueOf() - INT_A_DAY_IN_MILLISEC);
  }
}
