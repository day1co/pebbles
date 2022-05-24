import type { DataSizeType } from './unit-util.type';

export interface ConvertByteOpts {
  size: number;
  inputUnit: DataSizeType;
  outputUnit?: DataSizeType;
}
