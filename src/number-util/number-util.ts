export namespace NumberUtil {
  export function intValueOf(numStr: number | string): number {
    let result = numStr;

    if (typeof numStr !== 'number' && isNumeric(numStr)) {
      result = parseFloat(numStr);
    }

    if (!Number.isInteger(result) || typeof result === 'string') {
      throw new Error(`unable to convert "${numStr}" to integer type`);
    }
    return result;
  }

  export function valueOf(numStr: number | string): number {
    let result = numStr;

    if (typeof numStr !== 'number' && isNumeric(numStr)) {
      result = Number(numStr);
    }

    if (!Number.isFinite(result) || typeof result === 'string') {
      throw new Error(`unable to convert "${numStr}" to integer type`);
    }
    return result;
  }
}

function isNumeric(str: string): boolean {
  return !Number.isNaN(Number(str)) && !Number.isNaN(parseInt(str));
}
