import { DateUtil } from './date-util';
import type { LocalDateTimeFormatOpts } from './date-util.interface';

describe('DateUtil', () => {
  describe('isValidDate', () => {
    it('should return true with valid date', () => {
      expect(DateUtil.isValidDate(new Date())).toBe(true);
      expect(DateUtil.isValidDate(new Date(1))).toBe(true);
      expect(DateUtil.isValidDate(new Date('2000-01-01'))).toBe(true);
    });
    it('should return false with invalid date', () => {
      expect(DateUtil.isValidDate(new Date(''))).toBe(false);
      expect(DateUtil.isValidDate(new Date('abc'))).toBe(false);
      expect(DateUtil.isValidDate(new Date('2000년 01월 01일'))).toBe(false);
    });
  });

  describe('parse', () => {
    test('invalid date input throws error', () => {
      expect(() => DateUtil.parse('')).toThrow();
      expect(() => DateUtil.parse('abc')).toThrow();
      expect(() => DateUtil.parse('3월 9일')).toThrow();
    });
    test('valid date input returns instance of Date', () => {
      const testDate = new Date();
      expect(DateUtil.parse(testDate).getTime()).toEqual(testDate.getTime());
      expect(DateUtil.parse('2021-01-01T01:01:01Z').getTime()).toBe(new Date('2021-01-01T01:01:01Z').getTime());
      expect(DateUtil.parse('2021-10-10').getTime()).toEqual(new Date('2021-10-10').getTime());
    });
    test('original input value is maintained', () => {
      const testDate = new Date();
      const parsedDate = DateUtil.parse(testDate);
      parsedDate.setHours(parsedDate.getHours() + 1);
      expect(parsedDate.getTime()).not.toEqual(testDate.getTime());
    });
  });

  describe('calcDatetime', () => {
    test('should return error', () => {
      expect(() => DateUtil.calcDatetime('string', { year: 3 })).toThrow();
      expect(() => DateUtil.calcDatetime('20209999', { year: 3 })).toThrow();
      expect(() => DateUtil.calcDatetime('', { year: 3 })).toThrow();
    });
    test('add, sub year, month, date, ...', () => {
      expect(DateUtil.calcDatetime('2020-02-20 00:00:00', { year: 1 })).toEqual(new Date('2021-02-20 00:00:00'));
      expect(DateUtil.calcDatetime('2020-02-20 00:00:00', { month: 1 })).toEqual(new Date('2020-03-20 00:00:00'));
      expect(DateUtil.calcDatetime('2020-02-20 00:00:00', { date: 1 })).toEqual(new Date('2020-02-21 00:00:00'));
      expect(DateUtil.calcDatetime('2020-02-20 00:00:00', { hour: 1 })).toEqual(new Date('2020-02-20 01:00:00'));
      expect(DateUtil.calcDatetime('2020-02-20 00:00:00', { minute: 1 })).toEqual(new Date('2020-02-20 00:01:00'));
      expect(DateUtil.calcDatetime('2020-02-20 00:00:00', { second: 1 })).toEqual(new Date('2020-02-20 00:00:01'));

      expect(DateUtil.calcDatetime('2020-02-20 00:00:00', { year: -1 })).toEqual(new Date('2019-02-20 00:00:00'));
      expect(DateUtil.calcDatetime('2020-02-20 00:00:00', { month: -1 })).toEqual(new Date('2020-01-20 00:00:00'));
      expect(DateUtil.calcDatetime('2020-02-20 00:00:00', { date: -1 })).toEqual(new Date('2020-02-19 00:00:00'));
      expect(DateUtil.calcDatetime('2020-02-20 00:00:00', { hour: -1 })).toEqual(new Date('2020-02-19 23:00:00'));
      expect(DateUtil.calcDatetime('2020-02-20 00:00:00', { minute: -1 })).toEqual(new Date('2020-02-19 23:59:00'));
      expect(DateUtil.calcDatetime('2020-02-20 00:00:00', { second: -1 })).toEqual(new Date('2020-02-19 23:59:59'));
    });

    test('60이상의 숫자도 계산이 가능해야 함', () => {
      expect(DateUtil.calcDatetime('2020-02-20 00:00:00', { hour: 100 })).toEqual(new Date('2020-02-24 04:00:00')); // 100시간 => 4일 4시간
      expect(DateUtil.calcDatetime('2020-02-20 00:00:00', { minute: 100 })).toEqual(new Date('2020-02-20 01:40:00')); // 100분 => 1시간 40분
      expect(DateUtil.calcDatetime('2020-02-20 00:00:00', { second: 100 })).toEqual(new Date('2020-02-20 00:01:40')); // 100초 => 1분 40초

      expect(DateUtil.calcDatetime('2020-02-20 00:00:00', { hour: 100, minute: 100, second: 100 })).toEqual(
        new Date('2020-02-24 05:41:40')
      ); // 100시간 + 100분 + 100초 => 4일 5시간 41분 40초
    });
  });

  describe('beginOfMonth', () => {
    const beginOfMonth = DateUtil.beginOfMonth;
    it('should throw error when invalid Date given', () => {
      expect(() => beginOfMonth('zzzzz')).toThrow();
      expect(() => beginOfMonth('2021-13-01 00:00:00')).toThrow();
      expect(() => beginOfMonth(new Date('zzzzz'))).toThrow();
    });

    it('should accept Date object and return beginning of the month 00:00:00', () => {
      expect(beginOfMonth(new Date('2021-06-03 00:00:00'))).toEqual(new Date('2021-06-01 00:00:00'));
      expect(beginOfMonth(new Date('2021-07-23 00:00:00'))).toEqual(new Date('2021-07-01 00:00:00'));
      expect(beginOfMonth(new Date('2021-08-31 00:00:00'))).toEqual(new Date('2021-08-01 00:00:00'));
    });

    it('should accept string date and return first day of the month 00:00:00', () => {
      expect(beginOfMonth('2021-06-03 00:00:00')).toEqual(new Date('2021-06-01 00:00:00'));
      expect(beginOfMonth('2021-07-23 00:00:00')).toEqual(new Date('2021-07-01 00:00:00'));
      expect(beginOfMonth('2021-08-31 00:00:00')).toEqual(new Date('2021-08-01 00:00:00'));
    });
  });

  describe('endOfMonth', () => {
    const endOfMonth = DateUtil.endOfMonth;
    it('should throw error when invalid Date given', () => {
      expect(() => endOfMonth('zzzzz')).toThrow();
      expect(() => endOfMonth('2021-13-01 00:00:00')).toThrow();
      expect(() => endOfMonth(new Date('zzzzz'))).toThrow();
    });

    it('should accept Date object and return last day of the month 23:59:59', () => {
      expect(endOfMonth(new Date('2020-02-03 00:00:00'))).toEqual(new Date('2020-02-29 23:59:59.999'));
      expect(endOfMonth(new Date('2021-02-13 00:00:00'))).toEqual(new Date('2021-02-28 23:59:59.999'));
      expect(endOfMonth(new Date('2021-08-31 00:00:00'))).toEqual(new Date('2021-08-31 23:59:59.999'));
      expect(endOfMonth(new Date('2021-09-12 00:00:00'))).toEqual(new Date('2021-09-30 23:59:59.999'));
      expect(endOfMonth(new Date('2021-12-01 00:00:00'))).toEqual(new Date('2021-12-31 23:59:59.999'));
    });

    it('should accept string and return last day of the month 23:59:59', () => {
      expect(endOfMonth('2020-02-03 00:00:00')).toEqual(new Date('2020-02-29 23:59:59.999'));
      expect(endOfMonth('2021-02-13 00:00:00')).toEqual(new Date('2021-02-28 23:59:59.999'));
      expect(endOfMonth('2021-08-31 00:00:00')).toEqual(new Date('2021-08-31 23:59:59.999'));
      expect(endOfMonth('2021-09-12 00:00:00')).toEqual(new Date('2021-09-30 23:59:59.999'));
      expect(endOfMonth('2021-12-01 00:00:00')).toEqual(new Date('2021-12-31 23:59:59.999'));
    });
  });

  describe('lastDayOfMonth', () => {
    const lastDayOfMonth = DateUtil.lastDayOfMonth;
    it('should throw error when invalid Date given', () => {
      expect(() => lastDayOfMonth('zzzzz')).toThrow();
      expect(() => lastDayOfMonth('2021-13-01 00:00:00')).toThrow();
      expect(() => lastDayOfMonth(new Date('zzzzz'))).toThrow();
    });

    it('should accept Date object and return last day of the month 00:00:00', () => {
      expect(lastDayOfMonth(new Date('2020-02-03 00:00:00'))).toEqual(new Date('2020-02-29 00:00:00'));
      expect(lastDayOfMonth(new Date('2021-02-13 00:00:00'))).toEqual(new Date('2021-02-28 00:00:00'));
      expect(lastDayOfMonth(new Date('2021-08-31 00:00:00'))).toEqual(new Date('2021-08-31 00:00:00'));
      expect(lastDayOfMonth(new Date('2021-09-12 00:00:00'))).toEqual(new Date('2021-09-30 00:00:00'));
      expect(lastDayOfMonth(new Date('2021-12-01 00:00:00'))).toEqual(new Date('2021-12-31 00:00:00'));
    });

    it('should accept string and return last day of the month 00:00:00', () => {
      expect(lastDayOfMonth('2020-02-03 00:00:00')).toEqual(new Date('2020-02-29 00:00:00'));
      expect(lastDayOfMonth('2021-02-13 00:00:00')).toEqual(new Date('2021-02-28 00:00:00'));
      expect(lastDayOfMonth('2021-08-31 00:00:00')).toEqual(new Date('2021-08-31 00:00:00'));
      expect(lastDayOfMonth('2021-09-12 00:00:00')).toEqual(new Date('2021-09-30 00:00:00'));
      expect(lastDayOfMonth('2021-12-01 00:00:00')).toEqual(new Date('2021-12-31 00:00:00'));
    });
  });

  describe('diff', () => {
    test('should throw error', () => {
      expect(() => DateUtil.diff('string', '2020-01-01- 10:00:00', 'year')).toThrow();
      expect(() => DateUtil.diff('2020-01-01- 10:00:00', 'string', 'year')).toThrow();
      expect(() => DateUtil.diff('', '', 'year')).toThrow();
    });
    test('get date diff', () => {
      // year
      expect(DateUtil.diff('2020-02-10 15:00:00', '2021-02-08 15:00:00', 'year')).toBe(0);
      expect(DateUtil.diff('2020-02-10 15:00:00', '2021-02-09 15:00:00', 'year')).toBe(0);
      expect(DateUtil.diff('2020-02-10 15:00:00', '2021-02-10 15:00:00', 'year')).toBe(1);
      expect(DateUtil.diff('2020-02-10 15:00:00', '2022-02-09 15:00:00', 'year')).toBe(1);
      expect(DateUtil.diff('2020-02-10 15:00:00', '2022-02-10 15:00:00', 'year')).toBe(2);

      // month
      expect(DateUtil.diff('2020-02-10 15:00:00', '2020-03-09 15:00:00', 'month')).toBe(0);
      expect(DateUtil.diff('2020-02-10 15:00:00', '2020-03-10 15:00:00', 'month')).toBe(1);
      expect(DateUtil.diff('2020-02-10 15:00:00', '2020-03-11 15:00:00', 'month')).toBe(1);
      expect(DateUtil.diff('2020-02-10 15:00:00', '2021-02-09 15:00:00', 'month')).toBe(11);
      expect(DateUtil.diff('2020-02-10 15:00:00', '2021-02-10 15:00:00', 'month')).toBe(12);

      // date
      expect(DateUtil.diff('2020-02-10 15:00:00', '2020-02-10 15:00:00', 'day')).toBe(0);
      expect(DateUtil.diff('2020-02-10 15:00:00', '2020-02-11 15:00:00', 'day')).toBe(1);
      expect(DateUtil.diff('2020-02-10 15:00:00', '2020-02-12 15:00:00', 'day')).toBe(2);
      expect(DateUtil.diff('2020-02-10 15:00:00', '2020-03-10 15:00:00', 'day')).toBe(29);

      // hour
      expect(DateUtil.diff('2020-02-10 15:00:00', '2020-02-10 15:59:59', 'hour')).toBe(0);
      expect(DateUtil.diff('2020-02-10 15:00:00', '2020-02-10 16:00:00', 'hour')).toBe(1);
      expect(DateUtil.diff('2020-02-10 15:00:00', '2020-02-11 15:00:00', 'hour')).toBe(24);

      // minute
      expect(DateUtil.diff('2020-02-10 15:00:00', '2020-02-10 15:00:59', 'minute')).toBe(0);
      expect(DateUtil.diff('2020-02-10 15:00:00', '2020-02-10 15:01:00', 'minute')).toBe(1);
      expect(DateUtil.diff('2020-02-10 15:00:00', '2020-02-10 15:20:00', 'minute')).toBe(20);
      expect(DateUtil.diff('2020-02-10 15:00:00', '2020-02-10 16:00:00', 'minute')).toBe(60);

      // second
      expect(DateUtil.diff('2020-02-10 15:00:00', '2020-02-10 15:00:00.999', 'second')).toBe(0);
      expect(DateUtil.diff('2020-02-10 15:00:00', '2020-02-10 15:00:01', 'second')).toBe(1);
      expect(DateUtil.diff('2020-02-10 15:00:00', '2020-02-10 15:00:59', 'second')).toBe(59);
      expect(DateUtil.diff('2020-02-10 15:00:00', '2020-02-10 15:01:00', 'second')).toBe(60);
      expect(DateUtil.diff('2020-02-10 15:00:00', '2020-02-10 16:00:00', 'second')).toBe(3600);
    });

    test('since가 until보다 큰 경우', () => {
      const since1 = '2020-02-10 15:00:00';
      const since2 = '2020-02-10 15:00:00';

      const until1 = '2022-02-09 15:00:00';
      const until2 = '2022-02-10 15:00:00';

      expect(DateUtil.diff(since1, until1, 'year')).toBe(-DateUtil.diff(until1, since1, 'year'));
      expect(DateUtil.diff(since2, until2, 'year')).toBe(-DateUtil.diff(until2, since2, 'year'));

      expect(DateUtil.diff(since1, until1, 'month')).toBe(-DateUtil.diff(until1, since1, 'month'));
      expect(DateUtil.diff(since2, until2, 'month')).toBe(-DateUtil.diff(until2, since2, 'month'));

      expect(DateUtil.diff(since1, until1, 'day')).toBe(-DateUtil.diff(until1, since1, 'day'));
      expect(DateUtil.diff(since2, until2, 'day')).toBe(-DateUtil.diff(until2, since2, 'day'));

      expect(DateUtil.diff(since1, until1, 'hour')).toBe(-DateUtil.diff(until1, since1, 'hour'));
      expect(DateUtil.diff(since2, until2, 'hour')).toBe(-DateUtil.diff(until2, since2, 'hour'));

      expect(DateUtil.diff(since1, until1, 'minute')).toBe(-DateUtil.diff(until1, since1, 'minute'));
      expect(DateUtil.diff(since2, until2, 'minute')).toBe(-DateUtil.diff(until2, since2, 'minute'));

      expect(DateUtil.diff(since1, until1, 'second')).toBe(-DateUtil.diff(until1, since1, 'second'));
      expect(DateUtil.diff(since2, until2, 'second')).toBe(-DateUtil.diff(until2, since2, 'second'));
    });

    test('since와 until이 같은 경우', () => {
      const since = '2020-02-10 15:00:00';

      expect(DateUtil.diff(since, since, 'year')).toBe(DateUtil.diff(since, since, 'year'));
      expect(DateUtil.diff(since, since, 'month')).toBe(DateUtil.diff(since, since, 'month'));
      expect(DateUtil.diff(since, since, 'day')).toBe(DateUtil.diff(since, since, 'day'));
      expect(DateUtil.diff(since, since, 'hour')).toBe(DateUtil.diff(since, since, 'hour'));
      expect(DateUtil.diff(since, since, 'minute')).toBe(DateUtil.diff(since, since, 'minute'));
      expect(DateUtil.diff(since, since, 'second')).toBe(DateUtil.diff(since, since, 'second'));
    });
  });

  describe('minDate', () => {
    const minDate = DateUtil.minDate;
    it('should throw error when invalid Date given', () => {
      expect(() => minDate('zzzzz')).toThrow();
      expect(() => minDate('2021-13-01 00:00:00')).toThrow();
      expect(() => minDate(new Date('zzzzz'))).toThrow();
    });

    it('should return former date', () => {
      expect(minDate('2021-08-01 00:00:00', '2021-08-01 00:00:01')).toEqual(new Date('2021-08-01 00:00:00'));
      expect(minDate('2021-08-01 00:00:01', '2021-08-01 00:00:00')).toEqual(new Date('2021-08-01 00:00:00'));
      expect(minDate('2999-12-31 00:00:01', '2999-12-31 00:00:00')).toEqual(new Date('2999-12-31 00:00:00'));
      expect(minDate(new Date('2021-08-01 00:00:00'), new Date('2021-08-01 00:00:01'))).toEqual(
        new Date('2021-08-01 00:00:00')
      );
      expect(minDate(new Date('2021-08-01 00:00:01'), new Date('2021-08-01 00:00:00'))).toEqual(
        new Date('2021-08-01 00:00:00')
      );
      expect(minDate('2021-08-01 00:00:02', '2021-08-01 00:00:01', '2021-08-01 00:00:00')).toEqual(
        new Date('2021-08-01 00:00:00')
      );
    });
  });

  describe('parseByFormat', () => {
    it('should throw error when invalid arguments given', () => {
      expect(() => DateUtil.parseByFormat('20210131', 'YYYYM')).toThrow();
      expect(() => DateUtil.parseByFormat('20210131', 'YYYYMMDDHHmmssSSSS')).not.toThrow();
    });

    it('should return valid date', () => {
      expect(DateUtil.parseByFormat('20210821001122', 'YYYYMMDDHHmmss')).toEqual(new Date('2021-08-21 00:11:22'));
      expect(DateUtil.parseByFormat('20210821001122', 'YYYYMMDDHHmmssSSS')).toEqual(new Date('2021-08-21 00:11:22'));
      expect(DateUtil.parseByFormat('20210821001122', 'YYYYMMDDHHmmss')).toEqual(new Date('2021-08-21 00:11:22'));
      expect(DateUtil.parseByFormat('08202121001122', 'MMYYYYDDHHmmss')).toEqual(new Date('2021-08-21 00:11:22'));
      expect(DateUtil.parseByFormat('24/12/2019 11:15:00', 'DD/MM/YYYY HH:mm:ss')).toEqual(
        new Date('2019-12-24 11:15:00')
      );
    });
  });

  describe('parseTimestamp', () => {
    it('should throw error when invalid arguments given', () => {
      expect(() => DateUtil.parseTimestamp('20210131')).not.toThrow();
      expect(() => DateUtil.parseTimestamp('2021013111223344112233')).toThrow();
    });

    it('should return valid date', () => {
      expect(DateUtil.parseTimestamp('20210821')).toEqual(new Date('2021-08-21 00:00:00'));
      expect(DateUtil.parseTimestamp('20210821001122')).toEqual(new Date('2021-08-21 00:11:22'));
      expect(DateUtil.parseTimestamp('20210821001122123')).toEqual(new Date('2021-08-21 00:11:22.123'));
    });
  });

  describe('parseUnixTime', () => {
    it('should return Date instance of given unix time', () => {
      // see https://www.epochconverter.com/
      expect(DateUtil.parseUnixTime('1000000000')).toEqual(new Date('2001-09-09T10:46:40+09:00'));
      expect(DateUtil.parseUnixTime('0')).toEqual(new Date(new Date('1970-01-01T00:00:00Z')));
      expect(DateUtil.parseUnixTime('-1000000000')).toEqual(new Date('1938-04-25T07:13:20+09:00'));
      expect(DateUtil.parseUnixTime(1000000000)).toEqual(new Date('2001-09-09T10:46:40+09:00'));
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
      expect(() => DateUtil.parseUnixTime('')).toThrow();
    });
  });

  describe('setUTCOffset', () => {
    const testDate1 = '2020-01-01 01:01:01Z';
    const testDate2 = '2020-01-01 00:00:00-09:00';
    const testDate3 = '2020-01-01 00:00:00+09:00';

    it('should set given date`s utc time by given offset', () => {
      expect(DateUtil.setUTCOffset(new Date(testDate1), 180)).toEqual(new Date('2020-01-01 04:01:01Z'));
      expect(DateUtil.setUTCOffset(new Date(testDate2), 180)).toEqual(new Date('2020-01-01 12:00:00Z'));
      expect(DateUtil.setUTCOffset(new Date(testDate3), 540)).toEqual(new Date('2020-01-01 00:00:00Z'));
    });

    it('should parse string to date and set it`s utc time by given offset', () => {
      expect(DateUtil.setUTCOffset(testDate1, 180)).toEqual(new Date('2020-01-01 04:01:01Z'));
      expect(DateUtil.setUTCOffset(testDate2, 180)).toEqual(new Date('2020-01-01 12:00:00Z'));
      expect(DateUtil.setUTCOffset(testDate3, 540)).toEqual(new Date('2020-01-01 00:00:00Z'));
    });
  });

  describe('format', () => {
    it('should throw with invalid format string', () => {
      expect(() => DateUtil.format(new Date(), { format: 'y년 m월 d일' })).toThrow();
      expect(() => DateUtil.format(new Date(), { format: 'yyyy-mm-dd' })).toThrow();
      expect(() => DateUtil.format(new Date(), { format: 'YYYY-MM-DD h' })).toThrow();
      expect(() => DateUtil.format(new Date(), { format: 'YYYY년 MM월 d일' })).toThrow();
    });

    it('should format date to string with specific format rule', () => {
      const testDate1 = new Date('2020-01-01 01:01:01:111');
      expect(DateUtil.format(testDate1, { format: 'YYYY-MM-DD HH:mm:ss' })).toEqual('2020-01-01 01:01:01');
      expect(DateUtil.format(testDate1, { format: 'YYYY-MM-DD HH:mm:ss.SSS' })).toEqual('2020-01-01 01:01:01.111');
      expect(DateUtil.format(testDate1, { format: 'YYYY년 MM월 DD일' })).toEqual('2020년 01월 01일');
      expect(DateUtil.format(testDate1, { format: 'YYYY년 M월 D일 H시 m분 s초' })).toEqual(
        '2020년 1월 1일 1시 1분 1초'
      );
      expect(DateUtil.format(testDate1, { format: 'M/D' })).toEqual('1/1');
      expect(DateUtil.format(testDate1, { format: 'MM월 DD일' })).toEqual('01월 01일');
      expect(DateUtil.format(testDate1, { format: 'YY/MM/DD' })).toEqual('20/01/01');
      expect(DateUtil.format(testDate1, { format: 'YYYYMMDDHHmmssSSS' })).toEqual('20200101010101111');

      const testDate2 = new Date('2020-11-11 23:23:23:999');
      expect(DateUtil.format(testDate2, { format: 'YYYY-MM-DD HH:mm:ss' })).toEqual('2020-11-11 23:23:23');
      expect(DateUtil.format(testDate2, { format: 'YYYY-MM-DD HH:mm:ss.SSS' })).toEqual('2020-11-11 23:23:23.999');
      expect(DateUtil.format(testDate2, { format: 'YYYY년 MM월 DD일' })).toEqual('2020년 11월 11일');
      expect(DateUtil.format(testDate2, { format: 'YYYY년 M월 D일 H시 m분 s초' })).toEqual(
        '2020년 11월 11일 23시 23분 23초'
      );
      expect(DateUtil.format(testDate2, { format: 'M/D' })).toEqual('11/11');
      expect(DateUtil.format(testDate2, { format: 'MM월 DD일' })).toEqual('11월 11일');
      expect(DateUtil.format(testDate2, { format: 'YY/MM/DD' })).toEqual('20/11/11');
      expect(DateUtil.format(testDate2, { format: 'YYYYMMDDHHmmssSSS' })).toEqual('20201111232323999');
    });

    it('should format date to string with default format rule', () => {
      const defaultFormat = 'YYYY-MM-DDTHH:mm:ss±00:00';
      const utcOffsetHourIdx = defaultFormat.indexOf('±') + 1;

      const localTimezoneOffset = -new Date().getTimezoneOffset();
      const localTimezoneHoursStr = String(Math.floor(localTimezoneOffset / 60));

      const testDate1 = new Date('2000-01-01T00:00:00Z');
      const testDate2 = new Date('2000-01-01T09:00:00+09:00');
      const testDate3 = new Date('2000-01-01T00:00:00');

      expect(DateUtil.format(testDate1).length).toBe(defaultFormat.length);
      expect(DateUtil.format(testDate1).slice(utcOffsetHourIdx, utcOffsetHourIdx + 2)).toBe(
        localTimezoneHoursStr.padStart(2, '0')
      );

      expect(DateUtil.format(testDate2).length).toBe(defaultFormat.length);
      expect(DateUtil.format(testDate2).slice(utcOffsetHourIdx, utcOffsetHourIdx + 2)).toBe(
        localTimezoneHoursStr.padStart(2, '0')
      );

      expect(DateUtil.format(testDate3).length).toBe(defaultFormat.length);
      expect(DateUtil.format(testDate3).slice(utcOffsetHourIdx, utcOffsetHourIdx + 2)).toBe(
        localTimezoneHoursStr.padStart(2, '0')
      );
    });

    it('should format date to string in UTC if isUTC option is true', () => {
      const testDate1 = new Date('2000-01-01 00:00:00.999Z');
      const testDate2 = new Date('2000-01-01 00:00:00-03:00');
      const testDate3 = new Date('2000-01-01 00:00:00+09:00');

      expect(DateUtil.format(testDate1, { isUTC: true })).toBe('2000-01-01T00:00:00Z');
      expect(DateUtil.format(testDate2, { isUTC: true })).toBe('2000-01-01T03:00:00Z');
      expect(DateUtil.format(testDate3, { isUTC: true })).toBe('1999-12-31T15:00:00Z');
    });
  });

  describe('formatToISOString', () => {
    it('should return date to ISO format string', () => {
      const testDate1 = new Date('2020-01-01 01:01:01:111');
      expect(DateUtil.formatToISOString(testDate1, { format: 'YYYY-MM-DD' })).toEqual('2020-01-01');
      expect(DateUtil.formatToISOString(testDate1, { format: 'YYYY-MM-DDTHH:mm:ss.SSS' })).toEqual(
        '2020-01-01T01:01:01.111'
      );
      expect(DateUtil.formatToISOString(testDate1, { format: 'YYYY-MM-DDTHH:mm:ss' })).toEqual('2020-01-01T01:01:01');

      const testDate2 = new Date('2020-11-11 23:23:23:999');
      expect(DateUtil.formatToISOString(testDate2, { format: 'YYYY-MM-DD' })).toEqual('2020-11-11');
      expect(DateUtil.formatToISOString(testDate2, { format: 'YYYY-MM-DDTHH:mm:ss.SSS' })).toEqual(
        '2020-11-11T23:23:23.999'
      );
      expect(DateUtil.formatToISOString(testDate2, { format: 'YYYY-MM-DDTHH:mm:ss' })).toEqual('2020-11-11T23:23:23');
    });
  });

  describe('formatDate', () => {
    it('should format date to YYYY-MM-DD format string', () => {
      expect(DateUtil.formatDate(new Date('2020-01-01 01:01:01:111'))).toBe('2020-01-01');
      expect(DateUtil.formatDate(new Date('2020-11-11 23:23:23:999'))).toBe('2020-11-11');
    });
    it('should format date to YYYY-MM-DD as UTC timezone', () => {
      const localRuntimeTimezone = new Date().getTimezoneOffset() / 60;
      const test1 = DateUtil.formatDate(new Date('2020-01-01 01:01:01:111'), true);
      const test2 = DateUtil.formatDate(new Date('2020-01-01 01:01:01:111Z'), true);
      const test3 = DateUtil.formatDate(new Date('2020-11-11 23:23:23:999'), true);
      const test4 = DateUtil.formatDate(new Date('2020-11-11 23:23:23:999Z'), true);

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

  describe('formatDatetime', () => {
    it('should format date to YYYY-MM-DD HH:mm:ss format string', () => {
      expect(DateUtil.formatDatetime(new Date('2020-01-01 01:01:01:111'))).toBe('2020-01-01 01:01:01');
      expect(DateUtil.formatDatetime(new Date('2020-11-11 23:23:23:999'))).toBe('2020-11-11 23:23:23');
    });
    it('should format date in local runtime as default', () => {
      const localRuntimeTimezone = new Date().getTimezoneOffset() / 60;
      if (localRuntimeTimezone !== 0) {
        expect(DateUtil.formatDatetime(new Date('2020-01-01 01:01:01:111Z'))).not.toBe('2020-01-01 01:01:01');
        expect(DateUtil.formatDatetime(new Date('2020-11-11 23:23:23:999Z'))).not.toBe('2020-11-12 23:23:23');
      } else {
        expect(DateUtil.formatDatetime(new Date('2020-01-01 01:01:01:111Z'))).toBe('2020-01-01 01:01:01');
        expect(DateUtil.formatDatetime(new Date('2020-11-11 23:23:23:999Z'))).toBe('2020-11-11 23:23:23');
      }
    });
    it('should format date to YYYY-MM-DD HH:mm:ss as UTC timezone if true value is provided as isUTC parameter', () => {
      expect(DateUtil.formatDatetime(new Date('2020-01-01 01:01:01:111Z'), true)).toBe('2020-01-01 01:01:01');
      expect(DateUtil.formatDatetime(new Date('2020-11-11 23:23:23:999Z'), true)).toBe('2020-11-11 23:23:23');
    });
  });

  describe('formatTimestamp', () => {
    it('should format date to YYYYMMDDHHmmssSSS format string', () => {
      expect(DateUtil.formatTimestamp(new Date('2020-01-01 01:01:01:111'))).toBe('20200101010101111');
      expect(DateUtil.formatTimestamp(new Date('2020-11-11 23:23:23:999'))).toBe('20201111232323999');
    });
    it('should format date in local runtime as default', () => {
      const localRuntimeTimezone = new Date().getTimezoneOffset() / 60;
      if (localRuntimeTimezone !== 0) {
        expect(DateUtil.formatTimestamp(new Date('2020-01-01 01:01:01:111Z'))).not.toBe('20200101010101111');
        expect(DateUtil.formatTimestamp(new Date('2020-11-11 23:23:23:999Z'))).not.toBe('20201112232323999');
      } else {
        expect(DateUtil.formatTimestamp(new Date('2020-01-01 01:01:01:111Z'))).toBe('20200101010101111');
        expect(DateUtil.formatTimestamp(new Date('2020-11-11 23:23:23:999Z'))).toBe('20201111232323999');
      }
    });
    it('should format date to YYYYMMDDHHmmssSSS as UTC timezone if true value is provided as isUTC parameter', () => {
      expect(DateUtil.formatTimestamp(new Date('2020-01-01 01:01:01:111Z'), true)).toBe('20200101010101111');
      expect(DateUtil.formatTimestamp(new Date('2020-11-11 23:23:23:999Z'), true)).toBe('20201111232323999');
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

  describe('formatInTwoDigitLocalTime', () => {
    const testDate1 = '2000-01-01 00:00:00+09:00';
    const testDate2 = '2000-01-01 12:00:00+09:00';
    const testDate3 = '2000-01-01 12:00:00Z';
    const testDate4 = new Date(testDate3).getTime();

    it('should format date in two digit with year', () => {
      const testOption: LocalDateTimeFormatOpts = {
        locale: 'ko',
        timeZone: 'Asia/Seoul',
        withYear: true,
      };
      expect(DateUtil.formatInTwoDigitLocalTime(testDate1, testOption)).toBe('99/12/31 (금) 자정');
      expect(DateUtil.formatInTwoDigitLocalTime(testDate2, testOption)).toBe('00/01/01 (토) 정오');
      expect(DateUtil.formatInTwoDigitLocalTime(testDate3, testOption)).toBe('00/01/01 (토) 21시');
      expect(DateUtil.formatInTwoDigitLocalTime(testDate4, testOption)).toBe('00/01/01 (토) 21시');

      expect(DateUtil.formatInTwoDigitLocalTime(new Date(testDate1), testOption)).toBe('99/12/31 (금) 자정');
      expect(DateUtil.formatInTwoDigitLocalTime(new Date(testDate2), testOption)).toBe('00/01/01 (토) 정오');
      expect(DateUtil.formatInTwoDigitLocalTime(new Date(testDate3), testOption)).toBe('00/01/01 (토) 21시');
      expect(DateUtil.formatInTwoDigitLocalTime(new Date(testDate4), testOption)).toBe('00/01/01 (토) 21시');
    });

    it('should format date in two digit without year', () => {
      const testOption: LocalDateTimeFormatOpts = {
        locale: 'ko-KR',
        timeZone: 'Asia/Seoul',
      };
      expect(DateUtil.formatInTwoDigitLocalTime(testDate1, testOption)).toBe('12/31 (금) 자정');
      expect(DateUtil.formatInTwoDigitLocalTime(testDate2, testOption)).toBe('01/01 (토) 정오');
      expect(DateUtil.formatInTwoDigitLocalTime(testDate3, testOption)).toBe('01/01 (토) 21시');
      expect(DateUtil.formatInTwoDigitLocalTime(testDate4, testOption)).toBe('01/01 (토) 21시');

      expect(DateUtil.formatInTwoDigitLocalTime(new Date(testDate1), testOption)).toBe('12/31 (금) 자정');
      expect(DateUtil.formatInTwoDigitLocalTime(new Date(testDate2), testOption)).toBe('01/01 (토) 정오');
      expect(DateUtil.formatInTwoDigitLocalTime(new Date(testDate3), testOption)).toBe('01/01 (토) 21시');
      expect(DateUtil.formatInTwoDigitLocalTime(new Date(testDate4), testOption)).toBe('01/01 (토) 21시');
    });
  });
});
