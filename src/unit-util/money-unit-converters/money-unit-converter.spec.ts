import { moneyUnitConverter } from '.';

describe('moneyUnitConverter', () => {
  it('exchange Currency for Fractional unit', () => {
    expect(moneyUnitConverter.convert({ size: 0.03, inputUnit: 'currency', outputUnit: 'fractionalUnit' })).toEqual(
      '3'
    );
    expect(moneyUnitConverter.convert({ size: 3.0, inputUnit: 'currency', outputUnit: 'fractionalUnit' })).toEqual(
      '300'
    );
    expect(moneyUnitConverter.convert({ size: 3, inputUnit: 'currency', outputUnit: 'fractionalUnit' })).toEqual('300');
    expect(moneyUnitConverter.convert({ size: 0, inputUnit: 'currency', outputUnit: 'fractionalUnit' })).toEqual('0');
    expect(moneyUnitConverter.convert({ size: 0.0, inputUnit: 'currency', outputUnit: 'fractionalUnit' })).toEqual('0');
  });

  // it('exchange Dollar for Cent Exception', () => {
  //   expect(() => exchangeDollarForCent('hello')).toThrow();
  //   expect(() => exchangeDollarForCent('hello')).toThrowError(`amount:hello, must provide a number.`);
  //   expect(() => exchangeDollarForCent(null)).toThrow();
  //   expect(() => exchangeDollarForCent(null)).toThrowError(`amount:null, must provide a number.`);
  //   expect(() => exchangeDollarForCent(undefined)).toThrow();
  //   expect(() => exchangeDollarForCent(undefined)).toThrowError(`amount:undefined, must provide a number.`);
  //   expect(() => exchangeDollarForCent('')).toThrow();
  //   expect(() => exchangeDollarForCent('')).toThrowError(`amount:, must provide a number.`);
  // });

  it('exchange Fractional unit For Currency', () => {
    expect(moneyUnitConverter.convert({ size: 3, inputUnit: 'fractionalUnit', outputUnit: 'currency' })).toEqual(
      '0.03'
    );
    expect(moneyUnitConverter.convert({ size: 3.0, inputUnit: 'fractionalUnit', outputUnit: 'currency' })).toEqual(
      '0.03'
    );
    expect(moneyUnitConverter.convert({ size: 0, inputUnit: 'fractionalUnit', outputUnit: 'currency' })).toEqual(
      '0.00'
    );
    expect(moneyUnitConverter.convert({ size: 0.0, inputUnit: 'fractionalUnit', outputUnit: 'currency' })).toEqual(
      '0.00'
    );
  });

  it('moneyUnitConverter makes exception', () => {
    expect(() => moneyUnitConverter.convert({ size: -1, inputUnit: 'currency', outputUnit: 'fractionalUnit' })).toThrow(
      'Size cannot be less than zero'
    );
    expect(() => moneyUnitConverter.convert({ size: 1, inputUnit: 'currency', outputUnit: 'currency' })).toThrow(
      'Output unit must be different from Input unit'
    );
    expect(() =>
      moneyUnitConverter.convert({ size: 1, inputUnit: 'fractionalUnit', outputUnit: 'fractionalUnit' })
    ).toThrow('Output unit must be different from Input unit');
  });
});
