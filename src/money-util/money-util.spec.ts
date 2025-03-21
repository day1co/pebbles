import { MoneyUtil } from './money-util';

describe('MoneyUtil', () => {
  describe('convertLocalCurrencyFormat', () => {
    it('should return string starting unit if exist and having comma every three digit', () => {
      expect(MoneyUtil.convertLocalCurrencyFormat(10000)).toEqual('10,000');
      expect(MoneyUtil.convertLocalCurrencyFormat(10000, { unit: '₩' })).toEqual('₩ 10,000');
      expect(MoneyUtil.convertLocalCurrencyFormat(10000000)).toEqual('10,000,000');
      expect(MoneyUtil.convertLocalCurrencyFormat(123456789, { currency: 'USD' })).toEqual('$123,456,789.00');
      expect(MoneyUtil.convertLocalCurrencyFormat(123456789, { currency: 'JPY' })).toEqual('￥123,456,789');
      expect(MoneyUtil.convertLocalCurrencyFormat(123456789, { currency: 'KRW' })).toEqual('₩123,456,789');
    });

    it('should handle zero values correctly', () => {
      expect(MoneyUtil.convertLocalCurrencyFormat(0)).toEqual('0');
      expect(MoneyUtil.convertLocalCurrencyFormat(0, { unit: '₩' })).toEqual('₩ 0');
      expect(MoneyUtil.convertLocalCurrencyFormat(0, { currency: 'USD' })).toEqual('$0.00');
      expect(MoneyUtil.convertLocalCurrencyFormat(0, { currency: 'JPY' })).toEqual('￥0');
      expect(MoneyUtil.convertLocalCurrencyFormat(0, { currency: 'KRW' })).toEqual('₩0');
    });

    it('should handle negative values correctly', () => {
      expect(MoneyUtil.convertLocalCurrencyFormat(-10000)).toEqual('-10,000');
      expect(MoneyUtil.convertLocalCurrencyFormat(-10000, { unit: '₩' })).toEqual('₩ -10,000');
      expect(MoneyUtil.convertLocalCurrencyFormat(-123456789, { currency: 'USD' })).toEqual('-$123,456,789.00');
      expect(MoneyUtil.convertLocalCurrencyFormat(-123456789, { currency: 'JPY' })).toEqual('-￥123,456,789');
      expect(MoneyUtil.convertLocalCurrencyFormat(-123456789, { currency: 'KRW' })).toEqual('-₩123,456,789');
    });

    it('should handle decimal precision correctly', () => {
      expect(MoneyUtil.convertLocalCurrencyFormat(1234.56, { currency: 'USD' })).toEqual('$1,234.56');
      expect(MoneyUtil.convertLocalCurrencyFormat(1234.5678, { currency: 'USD' })).toEqual('$1,234.57'); // Should round to 2 decimals
      expect(MoneyUtil.convertLocalCurrencyFormat(0.1 + 0.2, { currency: 'USD' })).toEqual('$0.30'); // Testing floating point precision
      expect(MoneyUtil.convertLocalCurrencyFormat(0.1 + 0.2)).toEqual('0.3'); // Without currency formatting
    });

    it('should handle very large numbers correctly', () => {
      const largeNumber = 10000000000000; // 10 trillion
      expect(MoneyUtil.convertLocalCurrencyFormat(largeNumber)).toEqual('10,000,000,000,000');
      expect(MoneyUtil.convertLocalCurrencyFormat(largeNumber, { currency: 'USD' })).toEqual('$10,000,000,000,000.00');
    });

    it('should handle very small decimal numbers correctly', () => {
      const smallNumber = 0.000001; // One millionth
      expect(MoneyUtil.convertLocalCurrencyFormat(smallNumber, { currency: 'USD' })).toEqual('$0.00'); // Should round to 2 decimals
      expect(MoneyUtil.convertLocalCurrencyFormat(smallNumber)).toEqual('0');
    });

    it('should handle non-finite values correctly', () => {
      expect(MoneyUtil.convertLocalCurrencyFormat(NaN)).toEqual('NaN');
      expect(MoneyUtil.convertLocalCurrencyFormat(Infinity)).toEqual('Infinity');
      expect(MoneyUtil.convertLocalCurrencyFormat(-Infinity)).toEqual('-Infinity');
    });

    it('should handle specific locale formatting correctly', () => {
      // Test with explicit locale settings
      expect(MoneyUtil.convertLocalCurrencyFormat(1234.56, { currency: 'USD', locale: 'en-US' })).toEqual('$1,234.56');
      expect(MoneyUtil.convertLocalCurrencyFormat(1234.56, { locale: 'en-US' })).toEqual('1,234.56');
      
      // Using different locales to verify formatting differences
      expect(MoneyUtil.convertLocalCurrencyFormat(1234.56, { locale: 'ko-KR' })).toEqual('1,234.56');
      expect(MoneyUtil.convertLocalCurrencyFormat(1234.56, { locale: 'ja-JP' })).toEqual('1,234.56');
    });
  });
});
