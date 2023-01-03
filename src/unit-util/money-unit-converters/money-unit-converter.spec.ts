import { moneyUnitConverter } from '.';

describe('moneyUnitConverter', () => {
  it('exchange Currency for Fractional unit', () => {
    expect(moneyUnitConverter.convert({ size: 123.45, inputUnit: 'currency', outputUnit: 'fractionalUnit' })).toEqual(
      '12345'
    );
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

  it('exchange Fractional unit For Currency', () => {
    expect(moneyUnitConverter.convert({ size: 12345, inputUnit: 'fractionalUnit', outputUnit: 'currency' })).toEqual(
      '123.45'
    );
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
