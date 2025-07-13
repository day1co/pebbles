import { moneyUnitConverter } from './money-unit-converter';

describe('moneyUnitConverter', () => {
  it('exchange Currency for Fractional unit', () => {
    expect(
      moneyUnitConverter.convert({
        value: 123.45,
        inputUnit: 'currency',
        outputUnit: 'fractionalUnit',
      })
    ).toEqual('12345');
    expect(
      moneyUnitConverter.convert({
        value: -123.45,
        inputUnit: 'currency',
        outputUnit: 'fractionalUnit',
      })
    ).toEqual('-12345');
    expect(
      moneyUnitConverter.convert({
        value: 0.03,
        inputUnit: 'currency',
        outputUnit: 'fractionalUnit',
      })
    ).toEqual('3');
    expect(
      moneyUnitConverter.convert({
        value: 3.0,
        inputUnit: 'currency',
        outputUnit: 'fractionalUnit',
      })
    ).toEqual('300');
    expect(
      moneyUnitConverter.convert({ value: 3, inputUnit: 'currency', outputUnit: 'fractionalUnit' })
    ).toEqual('300');
    expect(
      moneyUnitConverter.convert({ value: 0, inputUnit: 'currency', outputUnit: 'fractionalUnit' })
    ).toEqual('0');
    expect(
      moneyUnitConverter.convert({
        value: 0.0,
        inputUnit: 'currency',
        outputUnit: 'fractionalUnit',
      })
    ).toEqual('0');
    expect(
      moneyUnitConverter.convert({
        value: 132.3,
        inputUnit: 'currency',
        outputUnit: 'fractionalUnit',
      })
    ).toEqual('13230');
    expect(
      moneyUnitConverter.convert({
        value: 132.03,
        inputUnit: 'currency',
        outputUnit: 'fractionalUnit',
      })
    ).toEqual('13203');
    expect(
      moneyUnitConverter.convert({
        value: 2.3,
        inputUnit: 'currency',
        outputUnit: 'fractionalUnit',
      })
    ).toEqual('230');
    expect(
      moneyUnitConverter.convert({
        value: 2.312,
        inputUnit: 'currency',
        outputUnit: 'fractionalUnit',
      })
    ).toEqual('231');
    expect(
      moneyUnitConverter.convert({
        value: -2.312,
        inputUnit: 'currency',
        outputUnit: 'fractionalUnit',
      })
    ).toEqual('-231');
    expect(
      moneyUnitConverter.convert({
        value: 1.2345e14,
        inputUnit: 'currency',
        outputUnit: 'fractionalUnit',
      })
    ).toEqual('12345000000000000');
    expect(
      moneyUnitConverter.convert({
        value: 1.2345e-1,
        inputUnit: 'currency',
        outputUnit: 'fractionalUnit',
      })
    ).toEqual('12');
  });

  it('exchange Fractional unit For Currency', () => {
    expect(
      moneyUnitConverter.convert({
        value: 12345,
        inputUnit: 'fractionalUnit',
        outputUnit: 'currency',
      })
    ).toEqual('123.45');
    expect(
      moneyUnitConverter.convert({
        value: -12345,
        inputUnit: 'fractionalUnit',
        outputUnit: 'currency',
      })
    ).toEqual('-123.45');
    expect(
      moneyUnitConverter.convert({ value: 3, inputUnit: 'fractionalUnit', outputUnit: 'currency' })
    ).toEqual('0.03');
    expect(
      moneyUnitConverter.convert({
        value: 3.0,
        inputUnit: 'fractionalUnit',
        outputUnit: 'currency',
      })
    ).toEqual('0.03');
    expect(
      moneyUnitConverter.convert({ value: 0, inputUnit: 'fractionalUnit', outputUnit: 'currency' })
    ).toEqual('0.00');
    expect(
      moneyUnitConverter.convert({
        value: 0.0,
        inputUnit: 'fractionalUnit',
        outputUnit: 'currency',
      })
    ).toEqual('0.00');
    expect(
      moneyUnitConverter.convert({
        value: 132.3,
        inputUnit: 'fractionalUnit',
        outputUnit: 'currency',
      })
    ).toEqual('1.32');
    expect(
      moneyUnitConverter.convert({
        value: -132.3,
        inputUnit: 'fractionalUnit',
        outputUnit: 'currency',
      })
    ).toEqual('-1.32');
    expect(
      moneyUnitConverter.convert({
        value: 1.2345e14,
        inputUnit: 'fractionalUnit',
        outputUnit: 'currency',
      })
    ).toEqual('1234500000000.00');
    expect(
      moneyUnitConverter.convert({
        value: 123.45e-1,
        inputUnit: 'fractionalUnit',
        outputUnit: 'currency',
      })
    ).toEqual('0.12');
  });

  it('no change for same input/output unit', () => {
    expect(
      moneyUnitConverter.convert({ value: 3.0, inputUnit: 'currency', outputUnit: 'currency' })
    ).toEqual('3');
    expect(
      moneyUnitConverter.convert({
        value: 3.0,
        inputUnit: 'fractionalUnit',
        outputUnit: 'fractionalUnit',
      })
    ).toEqual('3');
  });
});
