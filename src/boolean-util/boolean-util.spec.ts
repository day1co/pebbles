import { valueOfBoolean } from './boolean-util';

describe('valueOfBoolean', () => {
  it('should throw with incompatible input', () => {
    expect(() => valueOfBoolean('abc')).toThrow();
    expect(() => valueOfBoolean('1111')).toThrow();
    expect(() => valueOfBoolean('')).toThrow();
    expect(() => valueOfBoolean('nay')).toThrow();
  });
  it('should return parameter in boolean type', () => {
    expect(valueOfBoolean('true')).toEqual(true);
    expect(valueOfBoolean('false')).toEqual(false);
    expect(valueOfBoolean('1')).toEqual(true);
    expect(valueOfBoolean('0')).toEqual(false);
    expect(valueOfBoolean('yes')).toEqual(true);
    expect(valueOfBoolean('no')).toEqual(false);
    expect(valueOfBoolean('Y')).toEqual(true);
    expect(valueOfBoolean('N')).toEqual(false);
    expect(valueOfBoolean('On')).toEqual(true);
    expect(valueOfBoolean('Off')).toEqual(false);
    expect(valueOfBoolean('TRUE')).toEqual(true);
    expect(valueOfBoolean('FALSE')).toEqual(false);
  });
});
