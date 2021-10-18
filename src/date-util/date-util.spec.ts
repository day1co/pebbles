import { DateUtil } from './date-util';

describe('DateUtil', () => {
  describe('calcDatetime', () => {
    test('should return error', () => {
      expect(() => {
        DateUtil.calcDatetime('string', { year: 3 });
      }).toThrow();
      expect(() => {
        DateUtil.calcDatetime('20209999', { year: 3 });
      }).toThrow();
      expect(() => {
        DateUtil.calcDatetime('', { year: 3 });
      }).toThrow();
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
    it('should throw error when invalid Date given', () => {
      const described_function = DateUtil.beginOfMonth;
      expect(() => described_function('zzzzz')).toThrow();
      expect(() => described_function('2021-13-01 00:00:00')).toThrow();
      expect(() => described_function(new Date('zzzzz'))).toThrow();
    });

    it('should accept Date object and return beginning of the month 00:00:00', () => {
      expect(DateUtil.beginOfMonth(new Date('2021-06-03 00:00:00'))).toEqual(new Date('2021-06-01 00:00:00'));
      expect(DateUtil.beginOfMonth(new Date('2021-07-23 00:00:00'))).toEqual(new Date('2021-07-01 00:00:00'));
      expect(DateUtil.beginOfMonth(new Date('2021-08-31 00:00:00'))).toEqual(new Date('2021-08-01 00:00:00'));
    });

    it('should accept string date and return first day of the month 00:00:00', () => {
      expect(DateUtil.beginOfMonth('2021-06-03 00:00:00')).toEqual(new Date('2021-06-01 00:00:00'));
      expect(DateUtil.beginOfMonth('2021-07-23 00:00:00')).toEqual(new Date('2021-07-01 00:00:00'));
      expect(DateUtil.beginOfMonth('2021-08-31 00:00:00')).toEqual(new Date('2021-08-01 00:00:00'));
    });
  });

  describe('endOfMonth', () => {
    it('should throw error when invalid Date given', () => {
      const described_function = DateUtil.endOfMonth;
      expect(() => described_function('zzzzz')).toThrow();
      expect(() => described_function('2021-13-01 00:00:00')).toThrow();
      expect(() => described_function(new Date('zzzzz'))).toThrow();
    });

    it('should accept Date object and return last day of the month 23:59:59', () => {
      expect(DateUtil.endOfMonth(new Date('2020-02-03 00:00:00'))).toEqual(new Date('2020-02-29 23:59:59.999'));
      expect(DateUtil.endOfMonth(new Date('2021-02-13 00:00:00'))).toEqual(new Date('2021-02-28 23:59:59.999'));
      expect(DateUtil.endOfMonth(new Date('2021-08-31 00:00:00'))).toEqual(new Date('2021-08-31 23:59:59.999'));
      expect(DateUtil.endOfMonth(new Date('2021-09-12 00:00:00'))).toEqual(new Date('2021-09-30 23:59:59.999'));
      expect(DateUtil.endOfMonth(new Date('2021-12-01 00:00:00'))).toEqual(new Date('2021-12-31 23:59:59.999'));
    });

    it('should accept string and return last day of the month 23:59:59', () => {
      expect(DateUtil.endOfMonth('2020-02-03 00:00:00')).toEqual(new Date('2020-02-29 23:59:59.999'));
      expect(DateUtil.endOfMonth('2021-02-13 00:00:00')).toEqual(new Date('2021-02-28 23:59:59.999'));
      expect(DateUtil.endOfMonth('2021-08-31 00:00:00')).toEqual(new Date('2021-08-31 23:59:59.999'));
      expect(DateUtil.endOfMonth('2021-09-12 00:00:00')).toEqual(new Date('2021-09-30 23:59:59.999'));
      expect(DateUtil.endOfMonth('2021-12-01 00:00:00')).toEqual(new Date('2021-12-31 23:59:59.999'));
    });
  });

  describe('lastDayOfMonth', () => {
    it('should throw error when invalid Date given', () => {
      const described_function = DateUtil.lastDayOfMonth;
      expect(() => described_function('zzzzz')).toThrow();
      expect(() => described_function('2021-13-01 00:00:00')).toThrow();
      expect(() => described_function(new Date('zzzzz'))).toThrow();
    });

    it('should accept Date object and return last day of the month 00:00:00', () => {
      expect(DateUtil.lastDayOfMonth(new Date('2020-02-03 00:00:00'))).toEqual(new Date('2020-02-29 00:00:00'));
      expect(DateUtil.lastDayOfMonth(new Date('2021-02-13 00:00:00'))).toEqual(new Date('2021-02-28 00:00:00'));
      expect(DateUtil.lastDayOfMonth(new Date('2021-08-31 00:00:00'))).toEqual(new Date('2021-08-31 00:00:00'));
      expect(DateUtil.lastDayOfMonth(new Date('2021-09-12 00:00:00'))).toEqual(new Date('2021-09-30 00:00:00'));
      expect(DateUtil.lastDayOfMonth(new Date('2021-12-01 00:00:00'))).toEqual(new Date('2021-12-31 00:00:00'));
    });

    it('should accept string and return last day of the month 00:00:00', () => {
      expect(DateUtil.lastDayOfMonth('2020-02-03 00:00:00')).toEqual(new Date('2020-02-29 00:00:00'));
      expect(DateUtil.lastDayOfMonth('2021-02-13 00:00:00')).toEqual(new Date('2021-02-28 00:00:00'));
      expect(DateUtil.lastDayOfMonth('2021-08-31 00:00:00')).toEqual(new Date('2021-08-31 00:00:00'));
      expect(DateUtil.lastDayOfMonth('2021-09-12 00:00:00')).toEqual(new Date('2021-09-30 00:00:00'));
      expect(DateUtil.lastDayOfMonth('2021-12-01 00:00:00')).toEqual(new Date('2021-12-31 00:00:00'));
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
    it('should throw error when invalid Date given', () => {
      const described_function = DateUtil.minDate;
      expect(() => described_function('zzzzz')).toThrow();
      expect(() => described_function('2021-13-01 00:00:00')).toThrow();
      expect(() => described_function(new Date('zzzzz'))).toThrow();
    });

    it('should return former date', () => {
      expect(DateUtil.minDate('2021-08-01 00:00:00', '2021-08-01 00:00:01')).toEqual(new Date('2021-08-01 00:00:00'));
      expect(DateUtil.minDate('2021-08-01 00:00:01', '2021-08-01 00:00:00')).toEqual(new Date('2021-08-01 00:00:00'));
      expect(DateUtil.minDate('2999-12-31 00:00:01', '2999-12-31 00:00:00')).toEqual(new Date('2999-12-31 00:00:00'));
      expect(DateUtil.minDate(new Date('2021-08-01 00:00:00'), new Date('2021-08-01 00:00:01'))).toEqual(
        new Date('2021-08-01 00:00:00')
      );
      expect(DateUtil.minDate(new Date('2021-08-01 00:00:01'), new Date('2021-08-01 00:00:00'))).toEqual(
        new Date('2021-08-01 00:00:00')
      );
      expect(DateUtil.minDate('2021-08-01 00:00:02', '2021-08-01 00:00:01', '2021-08-01 00:00:00')).toEqual(
        new Date('2021-08-01 00:00:00')
      );
    });
  });
});
