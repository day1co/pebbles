import type { ConvertOpts, UnitConverter } from '../unit-util.interface';
import type { ByteUnitType } from './byte-unit-converter.type';

const BYTE_UNIT_SQRT_DIFF = 3;
const BYTE_UNIT_MULTIPLE_DIFF = 1000;

export class ByteUnitConverter implements UnitConverter<ByteUnitType> {
  private readonly byteUnitOrderList: Array<ByteUnitType> = ['bytes', 'kilobytes', 'megabytes'];
  private readonly byteUnitNotationMap: Record<ByteUnitType, string> = {
    bytes: 'bytes',
    kilobytes: 'KB',
    megabytes: 'MB',
  };

  public convert({ size, inputUnit, outputUnit }: Readonly<ConvertOpts<ByteUnitType>>): string {
    if (size < 0) {
      throw new Error('Data size cannot be less than zero');
    }

    const inputUnitIdx = this.byteUnitOrderList.indexOf(inputUnit);
    outputUnit = outputUnit ?? this.getConvertableUnit(size, inputUnitIdx);
    const outputUnitIdx = this.byteUnitOrderList.indexOf(outputUnit);

    if (!this.byteUnitOrderList[outputUnitIdx]) {
      return this.toString(size, inputUnit);
    }

    const idxGap = inputUnitIdx - outputUnitIdx;
    const converted = size * Math.pow(10, BYTE_UNIT_SQRT_DIFF * idxGap);
    return this.toString(converted, outputUnit);
  }

  private toString(size: number, outputUnit: ByteUnitType): string {
    const retSize = size < 1 ? size : Math.round(size);
    return `${retSize} ${this.byteUnitNotationMap[outputUnit]}`;
  }

  private getConvertableUnit(size: number, inputUnitIdx: number): ByteUnitType {
    const toBiggerUnit = size < 1 ? false : true;

    let idxGap = 0;
    if (toBiggerUnit) {
      for (let tempSize = size; tempSize >= BYTE_UNIT_MULTIPLE_DIFF; idxGap++) {
        tempSize = Math.floor(tempSize / BYTE_UNIT_MULTIPLE_DIFF);
      }
    } else {
      for (let tempSize = size; tempSize < 1; idxGap--) {
        tempSize = tempSize * BYTE_UNIT_MULTIPLE_DIFF;
      }
    }
    const idx = idxGap + inputUnitIdx;
    return this.byteUnitOrderList[idx];
  }
}
