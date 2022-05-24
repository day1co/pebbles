import type { DataSizeType, DataSizeNotationMapType } from './unit-util.type';
import type { ConvertByteOpts } from './unit-util.interface';

const DATA_SIZE_UNIT_ORDER_LIST: Array<DataSizeType> = ['bytes', 'kilobytes', 'megabytes'];
const DATA_SIZE_UNIT_DIFF_BY_SQRT = 3;
const DATA_SIZE_UNIT_DIFF = 1000;

const DataSizeUnitMap: DataSizeNotationMapType = {
  bytes: 'bytes',
  kilobytes: 'KB',
  megabytes: 'MB',
};

export namespace UnitUtil {
  /**@description SI 접두어를 기준으로 합니다 (1000 단위 구분) */
  export function convertByte({ size, inputUnit, outputUnit }: Readonly<ConvertByteOpts>): string {
    if (size < 0) {
      throw new Error('Data size cannot be less than zero');
    }

    const inputUnitIdx = DATA_SIZE_UNIT_ORDER_LIST.indexOf(inputUnit);
    outputUnit = outputUnit ?? getMaxConvertableUnit(size, inputUnitIdx);
    const outputUnitIdx = DATA_SIZE_UNIT_ORDER_LIST.indexOf(outputUnit);

    if (!DATA_SIZE_UNIT_ORDER_LIST[outputUnitIdx]) {
      return toString(size, inputUnit);
    }

    const idxGap = inputUnitIdx - outputUnitIdx;
    const converted = size * Math.pow(10, DATA_SIZE_UNIT_DIFF_BY_SQRT * idxGap);
    return toString(converted, outputUnit);
  }
}

function toString(size: number, outputUnit: DataSizeType): string {
  const retSize = size < 1 ? size : Math.round(size);
  return `${retSize} ${DataSizeUnitMap[outputUnit]}`;
}

function getMaxConvertableUnit(size: number, inputUnitIdx: number): DataSizeType {
  const toBiggerUnit = size < 1 ? false : true;

  let idxGap = 0;
  if (toBiggerUnit) {
    for (let tempSize = size; tempSize >= DATA_SIZE_UNIT_DIFF; idxGap++) {
      tempSize = Math.floor(tempSize / DATA_SIZE_UNIT_DIFF);
    }
  } else {
    for (let tempSize = size; tempSize < 1; idxGap--) {
      tempSize = tempSize * DATA_SIZE_UNIT_DIFF;
    }
  }
  const idx = idxGap + inputUnitIdx;
  return DATA_SIZE_UNIT_ORDER_LIST[idx];
}
