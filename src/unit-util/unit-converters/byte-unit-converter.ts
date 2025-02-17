import type { ByteUnitType } from './byte-unit-converter.type';
import type { ConvertOpts, UnitConverter } from '../unit-util.interface';

const BYTE_UNIT_SQRT_DIFF = 3;
const BYTE_UNIT_MULTIPLE_DIFF = 1000;

class ByteUnitConverter implements UnitConverter<ByteUnitType> {
  private readonly byteUnitOrderList: Array<ByteUnitType> = ['bytes', 'kilobytes', 'megabytes'];
  private readonly byteUnitNotationMap: Record<ByteUnitType, string> = {
    bytes: 'bytes',
    kilobytes: 'KB',
    megabytes: 'MB',
  };

  public convert({ value, inputUnit, outputUnit }: Readonly<ConvertOpts<ByteUnitType>>): string {
    if (value < 0) {
      throw new Error('Value must be equal or greater than zero');
    }

    const inputUnitIdx = this.byteUnitOrderList.indexOf(inputUnit);
    outputUnit = outputUnit ?? this.getConvertableUnit(value, inputUnitIdx);
    const outputUnitIdx = this.byteUnitOrderList.indexOf(outputUnit);

    if (!this.byteUnitOrderList[outputUnitIdx]) {
      return this.toString(value, inputUnit);
    }

    const idxGap = inputUnitIdx - outputUnitIdx;
    const converted = value * Math.pow(10, BYTE_UNIT_SQRT_DIFF * idxGap);
    return this.toString(converted, outputUnit);
  }

  public toString(value: number, outputUnit: ByteUnitType): string {
    const retValue = value < 1 ? value : Math.round(value);
    return `${retValue} ${this.byteUnitNotationMap[outputUnit]}`;
  }

  private getConvertableUnit(value: number, inputUnitIdx: number): ByteUnitType {
    const toBiggerUnit = value < 1 ? false : true;

    let idxGap = 0;
    if (toBiggerUnit) {
      for (let tempValue = value; tempValue >= BYTE_UNIT_MULTIPLE_DIFF; idxGap++) {
        tempValue = Math.floor(tempValue / BYTE_UNIT_MULTIPLE_DIFF);
      }
    } else {
      for (let tempValue = value; tempValue < 1; idxGap--) {
        tempValue = tempValue * BYTE_UNIT_MULTIPLE_DIFF;
      }
    }
    const idx = idxGap + inputUnitIdx;
    return this.byteUnitOrderList[idx];
  }
}

export const byteUnitConverter = new ByteUnitConverter();
