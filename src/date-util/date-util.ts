import dayjs from 'dayjs';
import { LoggerFactory } from '../logger';

const logger = LoggerFactory.getLogger('common-util:date-util');

const TIMESTAMP_FORMAT = 'YYYYMMDDHHmmssSSS';

export namespace DateUtil {
  export function parse(s?: string, fmt?: string, fallback?: string): string | undefined {
    try {
      const m = dayjs(s);
      return m.isValid() ? m.format(fmt) : fallback;
    } catch (e) {
      logger.error('parse error', e, s, fmt);
      return fallback;
    }
  }

  export function parseTimestamp(s?: string, fallback?: string): string | undefined {
    return parse(s, TIMESTAMP_FORMAT, fallback);
  }
}
