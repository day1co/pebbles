export namespace MoneyUtil {
  export function formatNumberAsCurrency(num: number, unit = ''): string {
    if (Number.isFinite(num)) {
      return `${unit} ${Number(num).toLocaleString()}`.trim();
    }
    return String(num);
  }
}
