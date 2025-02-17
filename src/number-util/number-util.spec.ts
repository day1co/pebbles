import {
  decimalRoundDown,
  decimalRoundUp,
  fromPermyriad,
  intValueOf,
  isNumeric,
  parseNumber,
  toPermyriad,
} from './number-util';

describe('intValueOf', () => {
  it('should throw with incompatible input', () => {
    expect(() => intValueOf('abc')).toThrow();
    expect(() => intValueOf('4.5a')).toThrow();
    expect(() => intValueOf('1.2')).toThrow();
    expect(() => intValueOf('1.2.3')).toThrow();
    expect(() => intValueOf('')).toThrow();
    expect(() => intValueOf(String(Number.MIN_VALUE))).toThrow();
    expect(() => intValueOf(String(Number.EPSILON))).toThrow();
  });
  it('should return parameter in integer type', () => {
    expect(intValueOf('1')).toEqual(1);
    expect(intValueOf('-1')).toEqual(-1);
    expect(intValueOf('0')).toEqual(0);
    expect(intValueOf(String(Number.MAX_SAFE_INTEGER))).toEqual(Number.MAX_SAFE_INTEGER);
    expect(intValueOf(String(Number.MIN_SAFE_INTEGER))).toEqual(Number.MIN_SAFE_INTEGER);
    expect(intValueOf(String(Number.MAX_VALUE))).toEqual(Number.MAX_VALUE);
  });
});

describe('parseNumber', () => {
  it('should throw with incompatible input', () => {
    expect(() => parseNumber('abc')).toThrow();
    expect(() => parseNumber('4a')).toThrow();
    expect(() => parseNumber('1.2.3')).toThrow();
    expect(() => parseNumber('')).toThrow();
  });
  it('should return parameter in number type', () => {
    expect(parseNumber('-1')).toEqual(-1);
    expect(parseNumber('0')).toEqual(0);
    expect(parseNumber('1.2')).toEqual(1.2);
    expect(parseNumber('-1.2')).toEqual(-1.2);
    expect(parseNumber('-93339.228883747849')).toEqual(-93339.22888374786);
    expect(parseNumber('9488848.29000004833')).toEqual(9488848.290000048);
  });
});

describe('isNumeric', () => {
  it('should equal to all', () => {
    expect(isNumeric('0')).toEqual(true);
    expect(isNumeric('1')).toEqual(true);
    expect(isNumeric('01')).toEqual(true);
    expect(isNumeric('0.1')).toEqual(true);
    expect(isNumeric('-10')).toEqual(true);
    expect(isNumeric('-10.1231234')).toEqual(true);
  });
  it('should not equal to all', () => {
    expect(isNumeric('a')).toEqual(false);
    expect(isNumeric('0a')).toEqual(false);
    expect(isNumeric('0xa')).toEqual(false);
    expect(isNumeric('sdfsdfsdfa')).toEqual(false);
    expect(isNumeric('\\http')).toEqual(false);
    expect(isNumeric('1.2.3')).toEqual(false);
    expect(isNumeric('')).toEqual(false);
    expect(isNumeric('  ')).toEqual(false);
  });
});

describe('toPermyriad', () => {
  it('should throw', () => {
    expect(() => toPermyriad(NaN)).toThrow();
  });
  it('should convert to permyriad', () => {
    expect(toPermyriad(100)).toEqual(1_000_000);
    expect(toPermyriad(0.01)).toEqual(100);
    expect(toPermyriad(0.00001)).toEqual(0.1);
    expect(toPermyriad(10.005)).toEqual(100050);
    expect(toPermyriad(0)).toEqual(0);
  });
});

describe('fromPermyriad', () => {
  it('should throw', () => {
    expect(() => fromPermyriad(NaN)).toThrow();
  });
  it('should convert from permyriad', () => {
    expect(fromPermyriad(100)).toEqual(0.01);
    expect(fromPermyriad(0.1)).toEqual(0);
    expect(fromPermyriad(0)).toEqual(0);
  });
});

describe('decimalRoundUp & Down', () => {
  it('should throw', () => {
    expect(() => decimalRoundUp(NaN)).toThrow();
    expect(() => decimalRoundDown(NaN)).toThrow();
  });

  it('should convert from decimal places up', () => {
    expect(decimalRoundUp(100, 0)).toEqual(100);
    expect(decimalRoundUp(100, 3)).toEqual(100000);
    expect(decimalRoundUp(1.23456, 5)).toEqual(123456);
    expect(decimalRoundUp(100.2, 5)).toEqual(10020000);
    expect(decimalRoundUp(100.123456789, 2)).toEqual(10012);
    expect(decimalRoundUp(100.123456789, 5)).toEqual(10012346);
    expect(decimalRoundUp(203.502)).toEqual(20350);
    expect(decimalRoundUp(203.509)).toEqual(20351);
  });

  it('should convert from decimal places down', () => {
    expect(decimalRoundDown(100000, 0)).toEqual(100000);
    expect(decimalRoundDown(100000, 3)).toEqual(100);
    expect(decimalRoundDown(123456, 5)).toEqual(1.23456);
    expect(decimalRoundDown(10020000, 5)).toEqual(100.2);
    expect(decimalRoundDown(10012, 2)).toEqual(100.12);
    expect(decimalRoundDown(10012345, 5)).toEqual(100.12345);
    expect(decimalRoundDown(20351)).toEqual(203.51);
  });
});
