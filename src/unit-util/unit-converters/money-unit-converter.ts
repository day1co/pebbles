import type { MoneyUnitType } from './money-unit-converter.type';
import type { ConvertOpts, UnitConverter } from '../unit-util.interface';

class MoneyUnitConverter implements UnitConverter<MoneyUnitType> {
  // HIW 20230104
  // https://en.wikipedia.org/wiki/List_of_circulating_currencies
  // 거의 대부분의 세계 통화는 fractional unit이 currency의 1/100이다.
  // 예외적으로 1/1000이나 1/5인 경우가 있으나 우선 이런 경우에 대한 처리는 무시한다.
  private fractionRatio = 100;

  public convert({ value, inputUnit, outputUnit }: Readonly<ConvertOpts<MoneyUnitType>>): string {
    // money는 환불 data가 음수이므로 음수 체크는 제거
    // if (value < 0) {
    //   throw new Error('Value must be equal or greater than zero');
    // }
    const sign = value >= 0 ? '' : '-';
    value = Math.abs(value);

    if (inputUnit === outputUnit) {
      return value.toString();
    }

    let result: string;
    let currency, fractionalUnit;

    if (inputUnit === 'currency') {
      const valueStr = value.toString();

      if (valueStr.indexOf('.') >= 0) {
        const list = valueStr.split('.');
        currency = Number.parseInt(list[0]) * this.fractionRatio;
        fractionalUnit = Number.parseInt(list[1].substring(0, 2).padEnd(2, '0'));
        result = (currency + fractionalUnit).toString();
      } else {
        result = (value * this.fractionRatio).toString();
      }
    } else {
      value = Math.floor(value);

      if (!Number.isInteger(value)) {
        throw new Error('Value must be an integer when inputUnit is fractionalUnit');
      }

      fractionalUnit = value % this.fractionRatio;
      currency = (value - fractionalUnit) / this.fractionRatio;
      result = currency + '.' + fractionalUnit.toString().padStart(2, '0');
    }

    return sign + result;
  }
}

export const moneyUnitConverter = new MoneyUnitConverter();
