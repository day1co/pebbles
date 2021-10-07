import { DateUtil } from './date-util';

describe('DateUtil', () => {
  describe('calcDatetime', () => {
    test('should return fallback for error', () => {
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
  });
});
