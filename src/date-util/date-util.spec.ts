import { DateUtil } from './date-util';

describe('DateUtil', () => {
  describe('parse', () => {
    it('should return fallback for error', () => {
      expect(DateUtil.parse()).toBeTruthy();
      expect(DateUtil.parse(undefined, undefined, 'foo')).toBeTruthy();
      expect(DateUtil.parse('', undefined, 'foo')).toBe('foo');
      expect(DateUtil.parse(undefined, '', 'foo')).toBeTruthy();
      expect(DateUtil.parse('', '', 'foo')).toBe('foo');
    });
    test('should return fallback for invalid', () => {
      expect(DateUtil.parse('test', '', 'foo')).toBe('foo');
      expect(DateUtil.parse('this-is-invalid', undefined, 'foo')).toBe('foo');
    });
  });

  describe('parseTimestamp', () => {
    test('should return valid dayjs object', () => {
      const datetime = '2020-01-01 12:00:00';
      expect(DateUtil.parseTimestamp(datetime)).toBe('20200101120000000');
    });
  });
});
