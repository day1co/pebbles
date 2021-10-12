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
      expect(DateUtil.endOfMonth(new Date('2020-02-03 00:00:00'))).toEqual(new Date('2020-02-29 23:59:59'));
      expect(DateUtil.endOfMonth(new Date('2021-02-13 00:00:00'))).toEqual(new Date('2021-02-28 23:59:59'));
      expect(DateUtil.endOfMonth(new Date('2021-08-31 00:00:00'))).toEqual(new Date('2021-08-31 23:59:59'));
      expect(DateUtil.endOfMonth(new Date('2021-09-12 00:00:00'))).toEqual(new Date('2021-09-30 23:59:59'));
      expect(DateUtil.endOfMonth(new Date('2021-12-01 00:00:00'))).toEqual(new Date('2021-12-31 23:59:59'));
    });

    it('should accept string and return last day of the month 23:59:59', () => {
      expect(DateUtil.endOfMonth('2020-02-03 00:00:00')).toEqual(new Date('2020-02-29 23:59:59'));
      expect(DateUtil.endOfMonth('2021-02-13 00:00:00')).toEqual(new Date('2021-02-28 23:59:59'));
      expect(DateUtil.endOfMonth('2021-08-31 00:00:00')).toEqual(new Date('2021-08-31 23:59:59'));
      expect(DateUtil.endOfMonth('2021-09-12 00:00:00')).toEqual(new Date('2021-09-30 23:59:59'));
      expect(DateUtil.endOfMonth('2021-12-01 00:00:00')).toEqual(new Date('2021-12-31 23:59:59'));
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
});
