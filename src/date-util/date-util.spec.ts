import { DateUtil } from './date-util';
import type { LocalDateTimeFormatOpts } from './date-util.interface';
import { DATE_FORMAT, DATETIME_FORMAT_WITH_MILLIS, DEFAULT_DATETIME_FORMAT } from './date-util.const';

const now = new Date();
const testDateStr = '2022-02-23';
const testDatetimeStr1 = '2022-02-23 01:23';
const testDatetimeStr2 = '2022-02-23T01:23Z';
const testDatetimeStr3 = '2022-02-23 01:23:45';
const testDatetimeStr4 = '2022-02-23T01:23:45Z';
const testDatetimeStr5 = '2022-02-23T01:23:45';
const testDatetimeStr6 = '2022-02-23 01:23:45.678';
const testDatetimeStr7 = '2022-02-23T01:23:45.678Z';
const testDatetimeStr8 = '2022-02-23T01:23:45.678';

function getOffsetString(): string {
  const offset = new Date().getTimezoneOffset();
  const sign = offset > 0 ? '-' : '+';
  const timezoneOffset = Math.abs(offset);
  const offsetMinutes = timezoneOffset % 60;
  const offsetHours = (timezoneOffset - offsetMinutes) / 60;
  return `${sign}${String(offsetHours).padStart(2, '0')}:${String(offsetMinutes).padStart(2, '0')}`;
}

describe('DateUtil', () => {
  describe('isValidDate', () => {
    const isValidDate = DateUtil.isValidDate;
    it('should return true with valid date', () => {
      expect(isValidDate(new Date())).toBe(true);
      expect(isValidDate(new Date(1))).toBe(true);
      expect(isValidDate(new Date('2000-01-01'))).toBe(true);
    });
    it('should return false with invalid date', () => {
      expect(isValidDate(new Date(''))).toBe(false);
      expect(isValidDate(new Date('abc'))).toBe(false);
      expect(isValidDate(new Date('2000년 01월 01일'))).toBe(false);
    });
  });

  describe('parse', () => {
    const parse = DateUtil.parse;
    test('invalid date input throws error', () => {
      expect(() => parse('')).toThrow();
      expect(() => parse('abc')).toThrow();
      expect(() => parse('3월 9일')).toThrow();
    });
    test('valid date input returns instance of Date', () => {
      expect(parse(now).getTime()).toEqual(now.getTime());
      expect(parse(testDateStr).getTime()).toEqual(new Date('2022-02-23 00:00').getTime());
      expect(parse(testDatetimeStr1).getTime()).toEqual(new Date(testDatetimeStr1).getTime());
      expect(parse(testDatetimeStr2).getTime()).toEqual(new Date(testDatetimeStr2).getTime());
      expect(parse(testDatetimeStr3).getTime()).toEqual(new Date(testDatetimeStr3).getTime());
      expect(parse(testDatetimeStr4).getTime()).toEqual(new Date(testDatetimeStr4).getTime());
      expect(parse(testDatetimeStr6).getTime()).toEqual(new Date(testDatetimeStr6).getTime());
      expect(parse(testDatetimeStr7).getTime()).toEqual(new Date(testDatetimeStr7).getTime());
    });
    test('original input value is maintained', () => {
      const testDate = new Date();
      const parsedDate = parse(testDate);
      parsedDate.setHours(parsedDate.getHours() + 1);
      expect(parsedDate.getTime()).not.toBe(testDate.getTime());
    });
  });

  describe('parseByFormat', () => {
    it('should throw error when invalid arguments given', () => {
      expect(() => DateUtil.parseByFormat('20210131', 'YYYYM')).toThrow();
      expect(() => DateUtil.parseByFormat('20210131', 'YYYYMMDDHHmmssSSSS')).not.toThrow();
    });

    it('should return valid date', () => {
      expect(DateUtil.parseByFormat('20220223012345', 'YYYYMMDDHHmmss')).toEqual(new Date(testDatetimeStr3));
      expect(DateUtil.parseByFormat('02202223012345', 'MMYYYYDDHHmmss')).toEqual(new Date(testDatetimeStr3));
      expect(DateUtil.parseByFormat('20220223012345678', 'YYYYMMDDHHmmssSSS')).toEqual(new Date(testDatetimeStr6));
      expect(DateUtil.parseByFormat('23/02/2022 01:23:45', 'DD/MM/YYYY HH:mm:ss')).toEqual(new Date(testDatetimeStr3));
    });
  });

  describe('parseTimestamp', () => {
    it('should throw error when invalid arguments given', () => {
      expect(() => DateUtil.parseTimestamp('20210131')).not.toThrow();
      expect(() => DateUtil.parseTimestamp('2021013111223344112233')).toThrow();
    });

    it('should return valid date', () => {
      expect(DateUtil.parseTimestamp('20220223')).toEqual(DateUtil.parse(testDateStr));
      expect(DateUtil.parseTimestamp('20220223012345')).toEqual(new Date(testDatetimeStr3));
      expect(DateUtil.parseTimestamp('20220223012345678')).toEqual(new Date(testDatetimeStr6));
    });
  });

  describe('parseUnixTime', () => {
    it('should return Date instance of given unix time', () => {
      // see https://www.epochconverter.com/
      expect(DateUtil.parseUnixTime(1645579425)).toEqual(new Date(testDatetimeStr4));
      expect(DateUtil.parseUnixTime(0)).toEqual(new Date(new Date('1970-01-01T00:00:00Z')));
      expect(DateUtil.parseUnixTime(-1000000000)).toEqual(new Date('1938-04-25T07:13:20+09:00'));
    });

    it('should throw with invalid parameter', () => {
      expect(() => DateUtil.parseUnixTime(Number.NEGATIVE_INFINITY)).toThrow();
      expect(() => DateUtil.parseUnixTime(Number.POSITIVE_INFINITY)).toThrow();
      expect(() => DateUtil.parseUnixTime(Number.MAX_SAFE_INTEGER)).toThrow();
      expect(() => DateUtil.parseUnixTime(Number.MIN_SAFE_INTEGER)).toThrow();
      expect(() => DateUtil.parseUnixTime(8640000000001)).toThrow();
      expect(() => DateUtil.parseUnixTime(-8640000000001)).toThrow();
    });
  });

  describe('calcDatetime', () => {
    const calcDatetime = DateUtil.calcDatetime;
    test('should return error', () => {
      expect(() => calcDatetime('string', { year: 3 })).toThrow();
      expect(() => calcDatetime('20209999', { year: 3 })).toThrow();
      expect(() => calcDatetime('', { year: 3 })).toThrow();
    });
    test('add, sub year, month, date, ...', () => {
      expect(calcDatetime(testDatetimeStr6, { year: 1 })).toEqual(new Date('2023-02-23 01:23:45.678'));
      expect(calcDatetime(testDatetimeStr6, { month: 1 })).toEqual(new Date('2022-03-23 01:23:45.678'));
      expect(calcDatetime(testDatetimeStr6, { day: 1 })).toEqual(new Date('2022-02-24 01:23:45.678'));
      expect(calcDatetime(testDatetimeStr6, { hour: 1 })).toEqual(new Date('2022-02-23 02:23:45.678'));
      expect(calcDatetime(testDatetimeStr6, { minute: 1 })).toEqual(new Date('2022-02-23 01:24:45.678'));
      expect(calcDatetime(testDatetimeStr6, { second: 1 })).toEqual(new Date('2022-02-23 01:23:46.678'));

      expect(calcDatetime(testDatetimeStr6, { year: -1 })).toEqual(new Date('2021-02-23 01:23:45.678'));
      expect(calcDatetime(testDatetimeStr6, { month: -1 })).toEqual(new Date('2022-01-23 01:23:45.678'));
      expect(calcDatetime(testDatetimeStr6, { day: -1 })).toEqual(new Date('2022-02-22 01:23:45.678'));
      expect(calcDatetime(testDatetimeStr6, { hour: -1 })).toEqual(new Date('2022-02-23 00:23:45.678'));
      expect(calcDatetime(testDatetimeStr6, { minute: -1 })).toEqual(new Date('2022-02-23 01:22:45.678'));
      expect(calcDatetime(testDatetimeStr6, { second: -1 })).toEqual(new Date('2022-02-23 01:23:44.678'));
    });

    test('60이상의 숫자도 계산이 가능해야 함', () => {
      expect(calcDatetime(testDatetimeStr6, { hour: 100 })).toEqual(new Date('2022-02-27 05:23:45.678')); // 100시간 => 4일 4시간
      expect(calcDatetime(testDatetimeStr6, { minute: 100 })).toEqual(new Date('2022-02-23 03:03:45.678')); // 100분 => 1시간 40분
      expect(calcDatetime(testDatetimeStr6, { second: 100 })).toEqual(new Date('2022-02-23 01:25:25.678')); // 100초 => 1분 40초

      expect(calcDatetime(testDatetimeStr6, { hour: 100, minute: 100, second: 100 })).toEqual(
        new Date('2022-02-27 07:05:25.678')
      ); // 100시간 + 100분 + 100초 => 4일 5시간 41분 40초
    });
  });

  describe('startOf', () => {
    const startOf = DateUtil.startOf;
    it('should throw error when invalid Date given', () => {
      expect(() => startOf('zzzzz', 'year')).toThrow();
      expect(() => startOf('2021-13-01 00:00:00', 'month')).toThrow();
      expect(() => startOf(new Date('zzzzz'), 'day')).toThrow();
    });

    it('should return start of the year', () => {
      expect(startOf(testDatetimeStr6, 'year')).toEqual(new Date('2022-01-01 00:00:00.000'));
      expect(startOf(new Date(testDatetimeStr6), 'year')).toEqual(new Date('2022-01-01 00:00:00.000'));
    });

    it('should return start of the month', () => {
      expect(startOf(testDatetimeStr6, 'month')).toEqual(new Date('2022-02-01 00:00:00.000'));
      expect(startOf(new Date(testDatetimeStr6), 'month')).toEqual(new Date('2022-02-01 00:00:00.000'));
    });

    it('should return start of the day', () => {
      expect(startOf(testDatetimeStr6, 'day')).toEqual(new Date('2022-02-23 00:00:00.000'));
      expect(startOf(new Date(testDatetimeStr6), 'day')).toEqual(new Date('2022-02-23 00:00:00.000'));
    });

    it('should return start of the hour', () => {
      expect(startOf(testDatetimeStr6, 'hour')).toEqual(new Date('2022-02-23 01:00:00.000'));
      expect(startOf(new Date(testDatetimeStr6), 'hour')).toEqual(new Date('2022-02-23 01:00:00.000'));
    });

    it('should return start of the minute', () => {
      expect(startOf(testDatetimeStr6, 'minute')).toEqual(new Date('2022-02-23 01:23:00.000'));
      expect(startOf(new Date(testDatetimeStr6), 'minute')).toEqual(new Date('2022-02-23 01:23:00.000'));
    });

    it('should return start of the second', () => {
      expect(startOf(testDatetimeStr6, 'second')).toEqual(new Date('2022-02-23 01:23:45.000'));
      expect(startOf(new Date(testDatetimeStr6), 'second')).toEqual(new Date('2022-02-23 01:23:45.000'));
    });
  });

  describe('endOf', () => {
    const endOf = DateUtil.endOf;
    it('should throw error when invalid Date given', () => {
      expect(() => endOf('zzzzz', 'year')).toThrow();
      expect(() => endOf('2021-13-01 00:00:00', 'month')).toThrow();
      expect(() => endOf(new Date('zzzzz'), 'day')).toThrow();
    });

    it('should return end of the year', () => {
      expect(endOf(testDatetimeStr6, 'year')).toEqual(new Date('2022-12-31 23:59:59.999'));
      expect(endOf(new Date(testDatetimeStr6), 'year')).toEqual(new Date('2022-12-31 23:59:59.999'));
    });

    it('should return end of the month', () => {
      expect(endOf(testDatetimeStr6, 'month')).toEqual(new Date('2022-02-28 23:59:59.999'));
      expect(endOf(new Date(testDatetimeStr6), 'month')).toEqual(new Date('2022-02-28 23:59:59.999'));
    });

    it('should return end of the day', () => {
      expect(endOf(testDatetimeStr6, 'day')).toEqual(new Date('2022-02-23 23:59:59.999'));
      expect(endOf(new Date(testDatetimeStr6), 'day')).toEqual(new Date('2022-02-23 23:59:59.999'));
    });

    it('should return end of the hour', () => {
      expect(endOf(testDatetimeStr6, 'hour')).toEqual(new Date('2022-02-23 01:59:59.999'));
      expect(endOf(new Date(testDatetimeStr6), 'hour')).toEqual(new Date('2022-02-23 01:59:59.999'));
    });

    it('should return end of the minute', () => {
      expect(endOf(testDatetimeStr6, 'minute')).toEqual(new Date('2022-02-23 01:23:59.999'));
      expect(endOf(new Date(testDatetimeStr6), 'minute')).toEqual(new Date('2022-02-23 01:23:59.999'));
    });

    it('should return end of the second', () => {
      expect(endOf(testDatetimeStr6, 'second')).toEqual(new Date('2022-02-23 01:23:45.999'));
      expect(endOf(new Date(testDatetimeStr6), 'second')).toEqual(new Date('2022-02-23 01:23:45.999'));
    });
  });

  describe('isLastDateOfMonth', () => {
    const isLastDateOfMonth = DateUtil.isLastDateOfMonth;
    it('should accept Date object and check last date of the month', () => {
      expect(isLastDateOfMonth(new Date('2020-02-28'))).toBe(false);
      expect(isLastDateOfMonth(new Date('2020-02-29'))).toBe(true);
      expect(isLastDateOfMonth(new Date('2021-02-28'))).toBe(true);
    });

    it('should accept string and check last date of the month', () => {
      expect(isLastDateOfMonth('2020-02-28')).toBe(false);
      expect(isLastDateOfMonth('2020-02-29')).toBe(true);
      expect(isLastDateOfMonth('2021-02-28')).toBe(true);
    });
  });

  describe('diff', () => {
    const diff = DateUtil.diff;
    test('should throw error', () => {
      expect(() => diff('string', '2020-01-01- 10:00:00', 'year')).toThrow();
      expect(() => diff('2020-01-01- 10:00:00', 'string', 'year')).toThrow();
      expect(() => diff('', '', 'year')).toThrow();
    });
    test('get date diff', () => {
      // year
      expect(diff('2020-02-10 15:00:00', '2021-02-08 15:00:00', 'year')).toBe(0);
      expect(diff('2020-02-10 15:00:00', '2021-02-09 15:00:00', 'year')).toBe(0);
      expect(diff('2020-02-10 15:00:00', '2021-02-10 15:00:00', 'year')).toBe(1);
      expect(diff('2020-02-10 15:00:00', '2022-02-09 15:00:00', 'year')).toBe(1);
      expect(diff('2020-02-10 15:00:00', '2022-02-10 15:00:00', 'year')).toBe(2);

      // month
      expect(diff('2020-02-10 15:00:00', '2020-03-09 15:00:00', 'month')).toBe(0);
      expect(diff('2020-02-10 15:00:00', '2020-03-10 15:00:00', 'month')).toBe(1);
      expect(diff('2020-02-10 15:00:00', '2020-03-11 15:00:00', 'month')).toBe(1);
      expect(diff('2020-02-10 15:00:00', '2021-02-09 15:00:00', 'month')).toBe(11);
      expect(diff('2020-02-10 15:00:00', '2021-02-10 15:00:00', 'month')).toBe(12);

      // date
      expect(diff('2020-02-10 15:00:00', '2020-02-10 15:00:00', 'day')).toBe(0);
      expect(diff('2020-02-10 15:00:00', '2020-02-11 15:00:00', 'day')).toBe(1);
      expect(diff('2020-02-10 15:00:00', '2020-02-12 15:00:00', 'day')).toBe(2);
      expect(diff('2020-02-10 15:00:00', '2020-03-10 15:00:00', 'day')).toBe(29);

      // hour
      expect(diff('2020-02-10 15:00:00', '2020-02-10 15:59:59', 'hour')).toBe(0);
      expect(diff('2020-02-10 15:00:00', '2020-02-10 16:00:00', 'hour')).toBe(1);
      expect(diff('2020-02-10 15:00:00', '2020-02-11 15:00:00', 'hour')).toBe(24);

      // minute
      expect(diff('2020-02-10 15:00:00', '2020-02-10 15:00:59', 'minute')).toBe(0);
      expect(diff('2020-02-10 15:00:00', '2020-02-10 15:01:00', 'minute')).toBe(1);
      expect(diff('2020-02-10 15:00:00', '2020-02-10 15:20:00', 'minute')).toBe(20);
      expect(diff('2020-02-10 15:00:00', '2020-02-10 16:00:00', 'minute')).toBe(60);

      // second
      expect(diff('2020-02-10 15:00:00', '2020-02-10 15:00:00.999', 'second')).toBe(0);
      expect(diff('2020-02-10 15:00:00', '2020-02-10 15:00:01', 'second')).toBe(1);
      expect(diff('2020-02-10 15:00:00', '2020-02-10 15:00:59', 'second')).toBe(59);
      expect(diff('2020-02-10 15:00:00', '2020-02-10 15:01:00', 'second')).toBe(60);
      expect(diff('2020-02-10 15:00:00', '2020-02-10 16:00:00', 'second')).toBe(3600);
    });

    test('since가 until보다 큰 경우', () => {
      const since1 = '2020-02-10 15:00:00';
      const since2 = '2020-02-10 15:00:00';

      const until1 = '2022-02-09 15:00:00';
      const until2 = '2022-02-10 15:00:00';

      expect(diff(since1, until1, 'year')).toBe(-diff(until1, since1, 'year'));
      expect(diff(since2, until2, 'year')).toBe(-diff(until2, since2, 'year'));

      expect(diff(since1, until1, 'month')).toBe(-diff(until1, since1, 'month'));
      expect(diff(since2, until2, 'month')).toBe(-diff(until2, since2, 'month'));

      expect(diff(since1, until1, 'day')).toBe(-diff(until1, since1, 'day'));
      expect(diff(since2, until2, 'day')).toBe(-diff(until2, since2, 'day'));

      expect(diff(since1, until1, 'hour')).toBe(-diff(until1, since1, 'hour'));
      expect(diff(since2, until2, 'hour')).toBe(-diff(until2, since2, 'hour'));

      expect(diff(since1, until1, 'minute')).toBe(-diff(until1, since1, 'minute'));
      expect(diff(since2, until2, 'minute')).toBe(-diff(until2, since2, 'minute'));

      expect(diff(since1, until1, 'second')).toBe(-diff(until1, since1, 'second'));
      expect(diff(since2, until2, 'second')).toBe(-diff(until2, since2, 'second'));
    });

    test('since와 until이 같은 경우', () => {
      const since = '2020-02-10 15:00:00';

      expect(diff(since, since, 'year')).toBe(diff(since, since, 'year'));
      expect(diff(since, since, 'month')).toBe(diff(since, since, 'month'));
      expect(diff(since, since, 'day')).toBe(diff(since, since, 'day'));
      expect(diff(since, since, 'hour')).toBe(diff(since, since, 'hour'));
      expect(diff(since, since, 'minute')).toBe(diff(since, since, 'minute'));
      expect(diff(since, since, 'second')).toBe(diff(since, since, 'second'));
    });
  });

  describe('min', () => {
    const min = DateUtil.min;
    it('should throw error when invalid Date given', () => {
      expect(() => min('zzzzz')).toThrow();
      expect(() => min('2021-13-01 00:00:00')).toThrow();
      expect(() => min(new Date('zzzzz'))).toThrow();
    });

    it('should return former date', () => {
      expect(min('2021-08-01 00:00:00', testDatetimeStr6)).toEqual(new Date('2021-08-01 00:00:00'));
      expect(min(testDatetimeStr6, '2021-08-01 00:00:00')).toEqual(new Date('2021-08-01 00:00:00'));
      expect(min(new Date('2021-08-01 00:00:00'), new Date(testDatetimeStr6))).toEqual(new Date('2021-08-01 00:00:00'));
      expect(min(new Date(testDatetimeStr6), new Date('2021-08-01 00:00:00'))).toEqual(new Date('2021-08-01 00:00:00'));
      expect(min(testDatetimeStr6, testDatetimeStr3, '2021-08-01 00:00:00')).toEqual(new Date('2021-08-01 00:00:00'));
    });
  });

  describe('format', () => {
    const format = DateUtil.format;
    it('should return formatted date string in specific format', () => {
      const testDate = new Date(testDatetimeStr6);
      expect(format(testDate, { format: 'YYYY-MM-DD HH:mm:ss' })).toEqual(testDatetimeStr3);
      expect(format(testDate, { format: 'YYYY-MM-DD HH:mm:ss.SSS' })).toEqual(testDatetimeStr6);
      expect(format(testDate, { format: 'YYYY년 MM월 DD일' })).toEqual('2022년 02월 23일');
      expect(format(testDate, { format: 'YYYY년 M월 D일 H시 m분 s초' })).toEqual('2022년 2월 23일 1시 23분 45초');
      expect(format(testDate, { format: 'M/D' })).toEqual('2/23');
      expect(format(testDate, { format: 'MM월 DD일' })).toEqual('02월 23일');
      expect(format(testDate, { format: 'YY/MM/DD' })).toEqual('22/02/23');
      expect(format(testDate, { format: 'YYYYMMDDHHmmssSSS' })).toEqual('20220223012345678');
    });

    it('should return formatted date string in default format', () => {
      expect(DateUtil.format(new Date(testDatetimeStr3))).toBe(testDatetimeStr5 + getOffsetString());
    });

    it('should return formatted UTC string', () => {
      expect(DateUtil.format(new Date(testDatetimeStr7), { isUtc: true })).toBe(testDatetimeStr4);
      expect(DateUtil.format(new Date('2022-02-22 22:23:45-03:00'), { isUtc: true })).toBe(testDatetimeStr4);
      expect(DateUtil.format(new Date('2022-02-23 10:23:45+09:00'), { isUtc: true })).toBe(testDatetimeStr4);
    });
  });

  describe('formatInIso8601', () => {
    const formatInIso8601 = DateUtil.formatInIso8601;
    it('should return date to ISO format string', () => {
      const testDate = new Date(testDatetimeStr6);
      expect(formatInIso8601(testDate, { format: DATE_FORMAT })).toEqual('2022-02-23');
      expect(formatInIso8601(testDate, { format: DATETIME_FORMAT_WITH_MILLIS })).toEqual(
        testDatetimeStr8 + getOffsetString()
      );
      expect(formatInIso8601(testDate, { format: DEFAULT_DATETIME_FORMAT })).toEqual(
        testDatetimeStr5 + getOffsetString()
      );
    });
  });

  describe('getDateString', () => {
    const getDateString = DateUtil.getDateString;
    it('should format date to YYYY-MM-DD format string', () => {
      expect(getDateString(new Date(testDatetimeStr6))).toBe(testDateStr);
    });
    it('should format date to YYYY-MM-DD as UTC timezone', () => {
      const localRuntimeTimezone = new Date().getTimezoneOffset() / 60;
      const test1 = getDateString(new Date('2020-01-01 01:01:01:111'), true);
      const test2 = getDateString(new Date('2020-01-01 01:01:01:111Z'), true);
      const test3 = getDateString(new Date('2020-11-11 23:23:23:999'), true);
      const test4 = getDateString(new Date('2020-11-11 23:23:23:999Z'), true);

      if (localRuntimeTimezone < 0) {
        expect(test1).toBe('2019-12-31');
        expect(test2).toBe('2020-01-01');
        expect(test3).toBe('2020-11-11');
        expect(test4).toBe('2020-11-11');
      }
      if (localRuntimeTimezone > 0) {
        expect(test1).toBe('2020-01-01');
        expect(test2).toBe('2020-01-01');
        expect(test3).toBe('2020-11-12');
        expect(test4).toBe('2020-11-11');
      }
    });
  });

  describe('getDatetimeString', () => {
    const getDatetimeString = DateUtil.getDatetimeString;
    it('should format date to YYYY-MM-DD HH:mm:ss format string', () => {
      expect(getDatetimeString(new Date('2020-01-01 01:01:01:111'))).toBe('2020-01-01 01:01:01');
      expect(getDatetimeString(new Date('2020-11-11 23:23:23:999'))).toBe('2020-11-11 23:23:23');
    });
    it('should format date in local runtime as default', () => {
      const localRuntimeTimezone = new Date().getTimezoneOffset() / 60;
      if (localRuntimeTimezone !== 0) {
        expect(getDatetimeString(new Date('2020-01-01 01:01:01:111Z'))).not.toBe('2020-01-01 01:01:01');
        expect(getDatetimeString(new Date('2020-11-11 23:23:23:999Z'))).not.toBe('2020-11-12 23:23:23');
      } else {
        expect(getDatetimeString(new Date('2020-01-01 01:01:01:111Z'))).toBe('2020-01-01 01:01:01');
        expect(getDatetimeString(new Date('2020-11-11 23:23:23:999Z'))).toBe('2020-11-11 23:23:23');
      }
    });
    it('should format date to YYYY-MM-DD HH:mm:ss as UTC timezone if true value is provided as isUTC parameter', () => {
      expect(getDatetimeString(new Date('2020-01-01 01:01:01:111Z'), true)).toBe('2020-01-01 01:01:01');
      expect(getDatetimeString(new Date('2020-11-11 23:23:23:999Z'), true)).toBe('2020-11-11 23:23:23');
    });
  });

  describe('getTimestampString', () => {
    const getTimestampString = DateUtil.getTimestampString;
    it('should format date to YYYYMMDDHHmmssSSS format string', () => {
      expect(getTimestampString(new Date('2020-01-01 01:01:01:111'))).toBe('20200101010101111');
      expect(getTimestampString(new Date('2020-11-11 23:23:23:999'))).toBe('20201111232323999');
    });
    it('should format date in local runtime as default', () => {
      const localRuntimeTimezone = new Date().getTimezoneOffset() / 60;
      if (localRuntimeTimezone !== 0) {
        expect(getTimestampString(new Date('2020-01-01 01:01:01:111Z'))).not.toBe('20200101010101111');
        expect(getTimestampString(new Date('2020-11-11 23:23:23:999Z'))).not.toBe('20201112232323999');
      } else {
        expect(getTimestampString(new Date('2020-01-01 01:01:01:111Z'))).toBe('20200101010101111');
        expect(getTimestampString(new Date('2020-11-11 23:23:23:999Z'))).toBe('20201111232323999');
      }
    });
    it('should format date to YYYYMMDDHHmmssSSS as UTC timezone if true value is provided as isUTC parameter', () => {
      expect(getTimestampString(new Date('2020-01-01 01:01:01:111Z'), true)).toBe('20200101010101111');
      expect(getTimestampString(new Date('2020-11-11 23:23:23:999Z'), true)).toBe('20201111232323999');
    });
  });

  describe('secondsToTimeFormat', () => {
    it('음수를 넣으면 throw가 발생한다', () => {
      expect(() => DateUtil.secondsToTimeFormat(-5)).toThrow();
    });

    it('정상적인 값이 리턴되어야 한다', () => {
      expect(DateUtil.secondsToTimeFormat(0)).toEqual('00:00:00');
      expect(DateUtil.secondsToTimeFormat(10)).toEqual('00:00:10'); // 10초
      expect(DateUtil.secondsToTimeFormat(100)).toEqual('00:01:40'); // 100초 => 1분 40초
      expect(DateUtil.secondsToTimeFormat(1_000)).toEqual('00:16:40'); // 1,000초 => 16분 40초
      expect(DateUtil.secondsToTimeFormat(10_000)).toEqual('02:46:40'); // 10,000초 => 2시간 46분 40초
      expect(DateUtil.secondsToTimeFormat(100_000)).toEqual('27:46:40'); // 100,000초 => 27시간 46분 40초
    });
  });

  describe('formatLocalTime', () => {
    const testDate1 = '2000-01-01 00:00:00+09:00';
    const testDate2 = '2000-01-01 12:00:00+09:00';
    const testDate3 = '2000-01-01 12:00:00Z';
    const testDate4 = new Date(testDate3).getTime();

    it('should format date in two digit with year', () => {
      const testOption: LocalDateTimeFormatOpts = {
        locale: 'ko',
        timeZone: 'Asia/Seoul',
        formatStyle: '2-digit',
        withYear: true,
      };
      expect(DateUtil.formatLocalTime(testDate1, testOption)).toBe('99/12/31 (금) 자정');
      expect(DateUtil.formatLocalTime(testDate2, testOption)).toBe('00/01/01 (토) 정오');
      expect(DateUtil.formatLocalTime(testDate3, testOption)).toBe('00/01/01 (토) 21시');
      expect(DateUtil.formatLocalTime(testDate4, testOption)).toBe('00/01/01 (토) 21시');

      expect(DateUtil.formatLocalTime(new Date(testDate1), testOption)).toBe('99/12/31 (금) 자정');
      expect(DateUtil.formatLocalTime(new Date(testDate2), testOption)).toBe('00/01/01 (토) 정오');
      expect(DateUtil.formatLocalTime(new Date(testDate3), testOption)).toBe('00/01/01 (토) 21시');
      expect(DateUtil.formatLocalTime(new Date(testDate4), testOption)).toBe('00/01/01 (토) 21시');
    });

    it('should format date in two digit without year', () => {
      const testOption: LocalDateTimeFormatOpts = {
        locale: 'ko-KR',
        timeZone: 'Asia/Seoul',
        formatStyle: '2-digit',
      };
      expect(DateUtil.formatLocalTime(testDate1, testOption)).toBe('12/31 (금) 자정');
      expect(DateUtil.formatLocalTime(testDate2, testOption)).toBe('01/01 (토) 정오');
      expect(DateUtil.formatLocalTime(testDate3, testOption)).toBe('01/01 (토) 21시');
      expect(DateUtil.formatLocalTime(testDate4, testOption)).toBe('01/01 (토) 21시');

      expect(DateUtil.formatLocalTime(new Date(testDate1), testOption)).toBe('12/31 (금) 자정');
      expect(DateUtil.formatLocalTime(new Date(testDate2), testOption)).toBe('01/01 (토) 정오');
      expect(DateUtil.formatLocalTime(new Date(testDate3), testOption)).toBe('01/01 (토) 21시');
      expect(DateUtil.formatLocalTime(new Date(testDate4), testOption)).toBe('01/01 (토) 21시');
    });

    it('should format date in long description format without year', () => {
      const testOption: LocalDateTimeFormatOpts = {
        locale: 'ko-KR',
        timeZone: 'Asia/Seoul',
        formatStyle: 'long',
      };

      expect(DateUtil.formatLocalTime(testDate1, testOption)).toBe('12월 31일 금요일 자정');
      expect(DateUtil.formatLocalTime(testDate2, testOption)).toBe('1월 1일 토요일 정오');
      expect(DateUtil.formatLocalTime(testDate3, testOption)).toBe('1월 1일 토요일 21시');
      expect(DateUtil.formatLocalTime(testDate4, testOption)).toBe('1월 1일 토요일 21시');
    });

    it('should format date in long description format with year', () => {
      const testOption: LocalDateTimeFormatOpts = {
        locale: 'ko-KR',
        timeZone: 'Asia/Seoul',
        withYear: true,
        formatStyle: 'long',
      };

      expect(DateUtil.formatLocalTime(testDate1, testOption)).toBe('1999년 12월 31일 금요일 자정');
      expect(DateUtil.formatLocalTime(testDate2, testOption)).toBe('2000년 1월 1일 토요일 정오');
      expect(DateUtil.formatLocalTime(testDate3, testOption)).toBe('2000년 1월 1일 토요일 21시');
      expect(DateUtil.formatLocalTime(testDate4, testOption)).toBe('2000년 1월 1일 토요일 21시');
    });
  });
});
