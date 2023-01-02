import { MoneyUnitType } from './money-unit-converter.type';
import { ConvertOpts, UnitConverter } from '../unit-util.interface';

export class MoneyUnitConverter implements UnitConverter<MoneyUnitType> {
  convert({ size, inputUnit, outputUnit }: ConvertOpts<MoneyUnitType>): string {
    throw new Error('Method not implemented.');
  }
}
