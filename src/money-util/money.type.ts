export type Locale = 'ko-KR' | 'en-US' | 'ja-JP';
export type Currency = 'USD' | 'KRW' | 'JPY';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type LocaleMap<T> = {
  [Property in Currency]: Locale;
};
export interface ConvertLocalCurrencyFormatOpts {
  unit?: string;
  currency?: Currency;
  locale?: Locale;
}
