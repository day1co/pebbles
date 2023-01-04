export interface ConvertOpts<UNIT> {
  /**
   * @deprecated
   */
  size?: number;
  value?: number;
  inputUnit: UNIT;
  outputUnit?: UNIT;
}

export interface UnitConverter<UNIT> {
  convert({ value, inputUnit, outputUnit }: ConvertOpts<UNIT>): string;
}
