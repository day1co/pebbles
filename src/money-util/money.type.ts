export type Locale = 'ko-KR' | 'en-US' | 'ja-JP';
export type Currency = 'USD' | 'KRW' | 'JPY';
export type LocaleMap<T> = {
  [Property in Currency]: Locale;
};
export interface ConvertLocalCurrencyFormatOpts {
  unit?: string;
  currency?: Currency;
  locale?: Locale;
}
