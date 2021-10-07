import { LoggerFactory } from '../logger';
const logger = LoggerFactory.getLogger('common-util:date-util');

import { CalcDatetimeOpts } from './date-util.type';

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
}
