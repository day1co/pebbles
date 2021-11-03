export namespace NumberUtil {
  export function intValueOf(numStr: string): number {
    const result = Number(numStr);

    if (!numStr || !Number.isInteger(result)) {
      throw new Error(`unable to convert "${numStr}" to integer type`);
    }
    return result;
  }

  export function valueOf(numStr: string): number {
    const result = Number(numStr);

    if (!numStr || !Number.isFinite(result)) {
      throw new Error(`unable to convert "${numStr}" to number type`);
    }
    return result;
  }
}
