export namespace NumberUtil {
  export function intValueOf(numStr: string): number {
    const result = isNumeric(numStr) ? Number(numStr) : NaN;

    if (Number.isNaN(result) || !Number.isInteger(result)) {
      throw new Error(`unable to convert "${numStr}" to integer type`);
    }
    return result;
  }

  export function valueOf(numStr: string): number {
    const result = isNumeric(numStr) ? Number(numStr) : NaN;

    if (Number.isNaN(result) || !Number.isFinite(result)) {
      throw new Error(`unable to convert "${numStr}" to integer type`);
    }
    return result;
  }
}

function isNumeric(str: string): boolean {
  return !Number.isNaN(Number(str)) && !Number.isNaN(parseInt(str));
}
