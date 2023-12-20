export type Locale = 'ko-KR' | 'en-US' | 'ja-JP';
export type Currency = 'USD' | 'KRW' | 'JPY';
export type LocaleMap<T extends Currency> = {
  [Property in T]: Locale;
};
export interface ConvertLocalCurrencyFormatOpts {
  unit?: string;
  currency?: Currency;
  locale?: Locale;
}
