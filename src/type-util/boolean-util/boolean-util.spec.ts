import { BooleanUtil } from './boolean-util';

describe('BooleanUtil', () => {
  describe('valueOf', () => {
    it('should throw with incompatible input', () => {
      expect(() => BooleanUtil.valueOf('abc')).toThrow();
      expect(() => BooleanUtil.valueOf('1111')).toThrow();
      expect(() => BooleanUtil.valueOf('')).toThrow();
      expect(() => BooleanUtil.valueOf('nay')).toThrow();
    });
    it('should return parameter in boolean type', () => {
      expect(BooleanUtil.valueOf('true')).toEqual(true);
      expect(BooleanUtil.valueOf('false')).toEqual(false);
      expect(BooleanUtil.valueOf('1')).toEqual(true);
      expect(BooleanUtil.valueOf('0')).toEqual(false);
      expect(BooleanUtil.valueOf('yes')).toEqual(true);
      expect(BooleanUtil.valueOf('no')).toEqual(false);
      expect(BooleanUtil.valueOf('Y')).toEqual(true);
      expect(BooleanUtil.valueOf('N')).toEqual(false);
      expect(BooleanUtil.valueOf('On')).toEqual(true);
      expect(BooleanUtil.valueOf('Off')).toEqual(false);
      expect(BooleanUtil.valueOf('TRUE')).toEqual(true);
      expect(BooleanUtil.valueOf('FALSE')).toEqual(false);
    });
  });
});
