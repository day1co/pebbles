export namespace BooleanUtil {
  export function valueOf(boolStr: string): boolean {
    const TRUE_REGEXP = /^(t(rue)?|y(es)?|on|1)$/i;
    const FALSE_REGEXP = /^(f(alse)?|n(o)?|off|0)$/i;

    if (TRUE_REGEXP.test(boolStr.toLowerCase())) {
      return true;
    }
    if (FALSE_REGEXP.test(boolStr.toLowerCase())) {
      return false;
    }
    throw new Error(`unable to convert "${boolStr}" to boolean type`);
  }
}
