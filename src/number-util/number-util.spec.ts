import { NumberUtil } from './number-util';

describe('NumberUtil', () => {
  describe('intValueOf', () => {
    it('should throw with incompatible input', () => {
      expect(() => NumberUtil.intValueOf('abc')).toThrow();
      expect(() => NumberUtil.intValueOf('4.5a')).toThrow();
      expect(() => NumberUtil.intValueOf('1.2')).toThrow();
      expect(() => NumberUtil.intValueOf('1.2.3')).toThrow();
      expect(() => NumberUtil.intValueOf('')).toThrow();
      expect(() => NumberUtil.intValueOf(String(Number.MIN_VALUE))).toThrow();
      expect(() => NumberUtil.intValueOf(String(Number.EPSILON))).toThrow();
    });
    it('should return parameter in integer type', () => {
      expect(NumberUtil.intValueOf('1')).toEqual(1);
      expect(NumberUtil.intValueOf('-1')).toEqual(-1);
      expect(NumberUtil.intValueOf('0')).toEqual(0);
      expect(NumberUtil.intValueOf(String(Number.MAX_SAFE_INTEGER))).toEqual(Number.MAX_SAFE_INTEGER);
      expect(NumberUtil.intValueOf(String(Number.MIN_SAFE_INTEGER))).toEqual(Number.MIN_SAFE_INTEGER);
      expect(NumberUtil.intValueOf(String(Number.MAX_VALUE))).toEqual(Number.MAX_VALUE);
    });
  });

  describe('valueOf', () => {
    it('should throw with incompatible input', () => {
      expect(() => NumberUtil.valueOf('abc')).toThrow();
      expect(() => NumberUtil.valueOf('4a')).toThrow();
      expect(() => NumberUtil.valueOf('1.2.3')).toThrow();
      expect(() => NumberUtil.valueOf('')).toThrow();
    });
    it('should return parameter in number type', () => {
      expect(NumberUtil.valueOf('-1')).toEqual(-1);
      expect(NumberUtil.valueOf('0')).toEqual(0);
      expect(NumberUtil.valueOf('1.2')).toEqual(1.2);
      expect(NumberUtil.valueOf('-1.2')).toEqual(-1.2);
      expect(NumberUtil.valueOf('-93339.228883747849')).toEqual(-93339.22888374786);
      expect(NumberUtil.valueOf('9488848.29000004833')).toEqual(9488848.290000048);
    });
  });

  describe('isNumeric', () => {
    it('should equal to all', () => {
      expect(NumberUtil.isNumeric('0')).toEqual(true);
      expect(NumberUtil.isNumeric('1')).toEqual(true);
      expect(NumberUtil.isNumeric('01')).toEqual(true);
      expect(NumberUtil.isNumeric('0.1')).toEqual(true);
      expect(NumberUtil.isNumeric('-10')).toEqual(true);
      expect(NumberUtil.isNumeric('-10.1231234')).toEqual(true);
    });
    it('should not equal to all', () => {
      expect(NumberUtil.isNumeric('a')).toEqual(false);
      expect(NumberUtil.isNumeric('0a')).toEqual(false);
      expect(NumberUtil.isNumeric('0xa')).toEqual(false);
      expect(NumberUtil.isNumeric('sdfsdfsdfa')).toEqual(false);
      expect(NumberUtil.isNumeric('\\http')).toEqual(false);
      expect(NumberUtil.isNumeric('1.2.3')).toEqual(false);
      expect(NumberUtil.isNumeric('')).toEqual(false);
      expect(NumberUtil.isNumeric('  ')).toEqual(false);
    });
  });

  describe('toPermyriad', () => {
    it('should throw', () => {
      expect(() => NumberUtil.toPermyriad(NaN)).toThrow();
    });
    it('should convert to permyriad', () => {
      expect(NumberUtil.toPermyriad(100)).toEqual(1_000_000);
      expect(NumberUtil.toPermyriad(0.01)).toEqual(100);
      expect(NumberUtil.toPermyriad(0.00001)).toEqual(0.1);
      expect(NumberUtil.toPermyriad(10.005)).toEqual(100050);
      expect(NumberUtil.toPermyriad(0)).toEqual(0);
    });
  });

  describe('fromPermyriad', () => {
    it('should throw', () => {
      expect(() => NumberUtil.fromPermyriad(NaN)).toThrow();
    });
    it('should convert from permyriad', () => {
      expect(NumberUtil.fromPermyriad(100)).toEqual(0.01);
      expect(NumberUtil.fromPermyriad(0.1)).toEqual(0);
      expect(NumberUtil.fromPermyriad(0)).toEqual(0);
    });
  });
});
