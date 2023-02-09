import { LOCALES } from './money.const';
import { ConvertLocalCurrencyFormatOpts } from './money.type';

export namespace MoneyUtil {
  export function convertLocalCurrencyFormat(num: number, opts?: Readonly<ConvertLocalCurrencyFormatOpts>): string {
    const { unit = '', currency, locale } = opts ?? {};
    if (Number.isFinite(num)) {
      if (currency) {
        return num.toLocaleString(locale || LOCALES[currency], { style: 'currency', currency });
      }

      return [unit, num.toLocaleString(locale || 'ko-KR')].join(' ').trim();
    }
    return String(num);
  }
}
