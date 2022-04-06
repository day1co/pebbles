import { DateUtil } from './date-util';
import type { LocalDateTimeFormatOpts } from './date-util.interface';
import { DATE_FORMAT, DATETIME_FORMAT, DATETIME_FORMAT_WITH_MILLIS, TIMESTAMP_FORMAT } from './date-util.const';

const testDateStr = '2022-02-23';
const testDatetimeStr1 = '2022-02-23 01:23';
const testDatetimeStr2 = '2022-02-23T01:23Z';
const testDatetimeStr3 = '2022-02-23 01:23:45';
const testDatetimeStr4 = '2022-02-23T01:23:45Z';
const testDatetimeStr5 = '2022-02-23T01:23:45';
const testDatetimeStr6 = '2022-02-23 01:23:45.678';
const testDatetimeStr7 = '2022-02-23T01:23:45.678Z';
const testDatetimeStr8 = '2022-02-23T01:23:45.678';
const testTimestampStr = '20220223012345678';
const testDate = new Date(`${testDateStr} 00:00`);

function getOffsetString(date: Date, separatorFlag: boolean): string {
  const offset = date.getTimezoneOffset();
  const sign = offset > 0 ? '-' : '+';
  const timezoneOffset = Math.abs(offset);
  const offsetMinutes = timezoneOffset % 60;
  const offsetHours = (timezoneOffset - offsetMinutes) / 60;
  const separator = separatorFlag ? ':' : '';
  return `${sign}${String(offsetHours).padStart(2, '0')}${separator}${String(offsetMinutes).padStart(2, '0')}`;
}

describe('DateUtil', () => {
  describe('isValidDate', () => {
    const isValidDate = DateUtil.isValidDate;
    it('should return true with valid date', () => {
      expect(isValidDate(new Date())).toBe(true);
      expect(isValidDate(new Date(1))).toBe(true);
      expect(isValidDate(new Date(testDateStr))).toBe(true);
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
      const now = new Date();
      expect(parse(now)).toEqual(now);
      expect(parse(testDateStr)).toEqual(testDate);
      expect(parse(testDatetimeStr1)).toEqual(new Date(testDatetimeStr1));
      expect(parse(testDatetimeStr2)).toEqual(new Date(testDatetimeStr2));
      expect(parse(testDatetimeStr3)).toEqual(new Date(testDatetimeStr3));
      expect(parse(testDatetimeStr4)).toEqual(new Date(testDatetimeStr4));
      expect(parse(testDatetimeStr6)).toEqual(new Date(testDatetimeStr6));
      expect(parse(testDatetimeStr7)).toEqual(new Date(testDatetimeStr7));
    });
    test('original input value is maintained', () => {
      const now = new Date();
      const parsedDate = parse(now);
      parsedDate.setHours(parsedDate.getHours() + 1);
      expect(parsedDate).not.toBe(now);
    });
  });

  describe('parseByFormat', () => {
    const parseByFormat = DateUtil.parseByFormat;
    it('should throw error when invalid arguments given', () => {
      const testData = testTimestampStr.substring(0, 8);
      expect(() => parseByFormat(testData, 'YYYYM')).toThrow();
      expect(() => parseByFormat(testData, 'YYYYMMDDHHmmssSSS')).not.toThrow();
    });

    it('should return valid date', () => {
      const testData = testTimestampStr.substring(0, 14);
      expect(parseByFormat(testData, 'YYYYMMDDHHmmss')).toEqual(new Date(testDatetimeStr3));
      expect(parseByFormat('02202223012345', 'MMYYYYDDHHmmss')).toEqual(new Date(testDatetimeStr3));
      expect(parseByFormat('23/02/2022 01:23:45', 'DD/MM/YYYY HH:mm:ss')).toEqual(new Date(testDatetimeStr3));
    });
  });

  describe('parseTimestamp', () => {
    const parseTimestamp = DateUtil.parseTimestamp;
    it('should throw error when invalid arguments given', () => {
      expect(() => parseTimestamp(testTimestampStr.substring(0, 8))).not.toThrow();
      expect(() => parseTimestamp('2021013111223344112233')).toThrow();
    });

    it('should return valid date', () => {
      expect(parseTimestamp(testTimestampStr.substring(0, 8))).toEqual(testDate);
      expect(parseTimestamp(testTimestampStr.substring(0, 14))).toEqual(new Date(testDatetimeStr3));
      expect(parseTimestamp(testTimestampStr)).toEqual(new Date(testDatetimeStr6));
    });
  });

  describe('parseUnixTime', () => {
    const parseUnixTime = DateUtil.parseUnixTime;
    it('should return Date instance of given unix time', () => {
      // see https://www.epochconverter.com/
      expect(parseUnixTime(1645579425)).toEqual(new Date(testDatetimeStr4));
      expect(parseUnixTime(0)).toEqual(new Date(new Date('1970-01-01T00:00:00Z')));
      expect(parseUnixTime(-1000000000)).toEqual(new Date('1938-04-24T22:13:20Z'));
    });

    it('should throw with invalid parameter', () => {
      expect(() => parseUnixTime(Number.NEGATIVE_INFINITY)).toThrow();
      expect(() => parseUnixTime(Number.POSITIVE_INFINITY)).toThrow();
      expect(() => parseUnixTime(Number.MAX_SAFE_INTEGER)).toThrow();
      expect(() => parseUnixTime(Number.MIN_SAFE_INTEGER)).toThrow();
      expect(() => parseUnixTime(8640000000001)).toThrow();
      expect(() => parseUnixTime(-8640000000001)).toThrow();
    });
  });

  describe('calcDatetime', () => {
    const calcDatetime = DateUtil.calcDatetime;
    test('should throw error for invalid date', () => {
      expect(() => calcDatetime('string', { year: 3 })).toThrow();
      expect(() => calcDatetime('20209999', { year: 3 })).toThrow();
      expect(() => calcDatetime('', { year: 3 })).toThrow();
    });
    test('add/subtract year/month/day/hour/minute/second', () => {
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

    test('should return date for the over-unit-max-value', () => {
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
      expect(isLastDateOfMonth(DateUtil.parse('2020-02-28'))).toBe(false);
      expect(isLastDateOfMonth(DateUtil.parse('2020-02-29'))).toBe(true);
      expect(isLastDateOfMonth(DateUtil.parse('2021-02-28'))).toBe(true);
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
  });

  describe('min', () => {
    const min = DateUtil.min;
    it('should throw error when invalid date is given', () => {
      expect(() => min('zzzzz', new Date())).toThrow();
      expect(() => min('2021-13-01 00:00:00', new Date())).toThrow();
      expect(() => min(new Date('zzzzz'), new Date())).toThrow();
    });

    it('should return former date', () => {
      expect(min(testDateStr, testDatetimeStr6)).toEqual(testDate);
      expect(min(testDatetimeStr6, testDateStr)).toEqual(testDate);
      expect(min(testDate, new Date(testDatetimeStr6))).toEqual(testDate);
      expect(min(new Date(testDatetimeStr6), testDate)).toEqual(testDate);
      expect(min(testDatetimeStr6, testDatetimeStr3, testDate)).toEqual(testDate);
    });
  });

  describe('format', () => {
    const format = DateUtil.format;
    it('should return formatted date string in specific format', () => {
      const testDatetime = new Date(testDatetimeStr7);
      expect(format(testDatetime, { format: DATE_FORMAT })).toEqual(testDateStr);
      expect(format(testDatetime, { format: DATETIME_FORMAT_WITH_MILLIS })).toEqual(testDatetimeStr7);
      expect(format(testDatetime, { format: TIMESTAMP_FORMAT })).toEqual(testTimestampStr);
      expect(format(testDatetime, { format: 'YYYY-MM-DD HH:mm:ss.SSS' })).toEqual(testDatetimeStr6);
      expect(format(testDatetime, { format: 'YYYY년 MM월 DD일' })).toEqual('2022년 02월 23일');
      expect(format(testDatetime, { format: 'YYYY년 M월 D일 H시 m분 s초' })).toEqual('2022년 2월 23일 1시 23분 45초');
      expect(format(testDatetime, { format: 'M/D' })).toEqual('2/23');
      expect(format(testDatetime, { format: 'MM월 DD일' })).toEqual('02월 23일');
      expect(format(testDatetime, { format: 'YY/MM/DD' })).toEqual('22/02/23');
    });

    it('should return formatted date string in default format', () => {
      expect(format(new Date(testDatetimeStr7))).toBe(testDatetimeStr4);
      expect(format(new Date('2022-02-22T22:23:45-03:00'))).toBe(testDatetimeStr4);
      expect(format(new Date('2022-02-23T07:08:45+05:45'))).toBe(testDatetimeStr4);
    });

    it('should return formatted date string of local time when isUtc is false', () => {
      const testDatetime = new Date(testDatetimeStr6);
      expect(format(testDatetime, { isUtc: false })).toBe(testDatetimeStr3);
      expect(format(testDatetime, { format: 'YYYY-MM-DDTHH:mm:ss.SSSZZ', isUtc: false })).toEqual(
        testDatetimeStr8 + getOffsetString(testDatetime, false)
      );
    });
  });

  describe('formatInIso8601', () => {
    const formatInIso8601 = DateUtil.formatInIso8601;
    it('should return formatted date string in ISO format string', () => {
      const testDatetime = new Date(testDatetimeStr7);
      expect(formatInIso8601(testDatetime, { format: DATE_FORMAT })).toEqual(testDateStr);
      expect(formatInIso8601(testDatetime, { format: DATETIME_FORMAT })).toEqual(testDatetimeStr4);
      expect(formatInIso8601(testDatetime, { format: DATETIME_FORMAT_WITH_MILLIS })).toEqual(testDatetimeStr7);
    });
    it('should return formatted date string of local time', () => {
      const testDatetime = new Date(testDatetimeStr6);
      expect(formatInIso8601(testDatetime, { format: DATETIME_FORMAT, isUtc: false })).toEqual(
        testDatetimeStr5 + getOffsetString(testDatetime, true)
      );
    });
  });

  describe('getDateString', () => {
    const getDateString = DateUtil.getDateString;
    it('should return formatted date string', () => {
      expect(getDateString(new Date(testDatetimeStr7))).toBe(testDateStr);
    });
    it('should return formatted date string of local time', () => {
      expect(getDateString(new Date(testDatetimeStr6), false)).toBe(testDateStr);
    });
  });

  describe('getDatetimeString', () => {
    const getDatetimeString = DateUtil.getDatetimeString;
    it('should return format datetime string', () => {
      expect(getDatetimeString(new Date(testDatetimeStr7))).toBe(testDatetimeStr4);
    });
    it('should return formatted datetime string of local time', () => {
      expect(getDatetimeString(new Date(testDatetimeStr6), false)).toBe(testDatetimeStr3);
    });
  });

  describe('getTimestampString', () => {
    const getTimestampString = DateUtil.getTimestampString;
    it('should return formatted timestamp string', () => {
      expect(getTimestampString(new Date(testDatetimeStr7))).toBe(testTimestampStr);
    });
    it('should return formatted timestamp string of local time', () => {
      expect(getTimestampString(new Date(testDatetimeStr6), false)).toBe(testTimestampStr);
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
