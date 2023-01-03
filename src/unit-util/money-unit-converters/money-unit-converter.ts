import type { ConvertOpts, UnitConverter } from '../unit-util.interface';
import type { MoneyUnitType } from './money-unit-converter.type';

export class MoneyUnitConverter implements UnitConverter<MoneyUnitType> {
  public convert({ size, inputUnit, outputUnit }: Readonly<ConvertOpts<MoneyUnitType>>): string {
    if (size < 0) {
      throw new Error('Size cannot be less than zero');
    }

    if (inputUnit === outputUnit) {
      throw new Error('Output unit must be different from Input unit');
    }

    let result: string;
    let currency, fractionalUnit;

    if (inputUnit === 'currency') {
      const value = size.toString();

      if (value.indexOf('.') >= 0) {
        const list = value.split('.');
        currency = Number.parseInt(list[0]) * 100;
        fractionalUnit = Number.parseInt(list[1]);
        result = (currency + fractionalUnit).toString();
      } else {
        result = (size * 100).toString();
      }
    } else {
      fractionalUnit = size % 100;
      currency = (size - fractionalUnit) / 100;
      result = currency + '.' + fractionalUnit.toString().padStart(2, '0');
    }

    return result;
  }
}
