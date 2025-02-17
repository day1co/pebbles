import { parseBoolean } from './boolean-util';

describe('parseBoolean', () => {
  it('should throw with incompatible input', () => {
    expect(() => parseBoolean('abc')).toThrow();
    expect(() => parseBoolean('1111')).toThrow();
    expect(() => parseBoolean('')).toThrow();
    expect(() => parseBoolean('nay')).toThrow();
  });
  it('should return parameter in boolean type', () => {
    expect(parseBoolean('true')).toEqual(true);
    expect(parseBoolean('false')).toEqual(false);
    expect(parseBoolean('1')).toEqual(true);
    expect(parseBoolean('0')).toEqual(false);
    expect(parseBoolean('yes')).toEqual(true);
    expect(parseBoolean('no')).toEqual(false);
    expect(parseBoolean('Y')).toEqual(true);
    expect(parseBoolean('N')).toEqual(false);
    expect(parseBoolean('On')).toEqual(true);
    expect(parseBoolean('Off')).toEqual(false);
    expect(parseBoolean('TRUE')).toEqual(true);
    expect(parseBoolean('FALSE')).toEqual(false);
  });
});
