export interface ConvertOpts<UNIT> {
  size: number;
  inputUnit: UNIT;
  outputUnit?: UNIT;
}

export interface UnitConverter<UNIT> {
  convert({ size, inputUnit, outputUnit }: ConvertOpts<UNIT>): string;
}
