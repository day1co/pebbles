import { DateUtil } from './date-util';
import isValidDate = DateUtil.isValidDate;

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

  describe('beginOfMonth', () => {
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

  describe('isValidDate / toDate', () => {
    describe('isValidDate', () => {
      it('should check valueOf date is NaN', () => {
        expect(isValidDate(new Date('2021-01-01 00:00:00'))).toBe(true);
        expect(isValidDate(new Date('zzzzzzzzzzzzzzzzzzzz'))).toBe(false);
      });
    });

    describe('toDate', () => {
      const described_function = DateUtil.toDate;

      const expectToEqual = (v: string | Date) => {
        expect(described_function(v)).toEqual(new Date(v));
      };

      const expectToThrows = (v: string | Date) => {
        const wrapper = () => {
          described_function(v);
        };

        expect(wrapper).toThrow();
      };

      it('should return same value of date', () => {
        expectToEqual('2020-01-01 00:00:00');
        expectToEqual(new Date(2020, 15));
        expectToEqual('1');
      });

      it('should throw error', () => {
        expectToThrows('zzzzzzzzzzzzzz');
        expectToThrows('2021-13-01 00:00:00');
        expectToThrows(new Date('zzzzzzzzzzzzzz'));
      });
    });
  });
});
