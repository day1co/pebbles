export function intValueOf(numStr: string): number {
  const result = Number(numStr);

  if (!numStr || !Number.isInteger(result)) {
    throw new Error(`unable to convert "${numStr}" to integer type`);
  }
  return result;
}

export function isNumeric(numStr: string): boolean {
  const num = Number(numStr);
  return !isNaN(num) && isFinite(num) && num === parseFloat(numStr);
}

export const toPermyriad = (value: number, digits = 2): number => {
  if (isNaN(value)) {
    throw new Error(`unable to convert "${value}" to number type`);
  }

  return Number((value * 10_000).toFixed(digits));
};

export const fromPermyriad = (value: number, digits = 2): number => {
  if (isNaN(value)) {
    throw new Error(`unable to convert "${value}" to number type`);
  }

  return Number((value / 10_000).toFixed(digits));
};

export const decimalRoundUp = (floatValue: number, decimal = 2) => {
  if (isNaN(floatValue)) {
    throw new Error(`unable to convert "${floatValue}" to number type`);
  }
  if (decimal === 0) {
    return Math.round(floatValue);
  }
  const factor = Math.pow(10, decimal);
  return Math.round(floatValue * factor);
};

export const decimalRoundDown = (value: number, decimal = 2) => {
  if (isNaN(value)) {
    throw new Error(`unable to convert "${value}" to number type`);
  }
  if (decimal === 0) {
    return value;
  }
  return value / Math.pow(10, decimal);
};
