import { MoneyUtil } from './money-util';

describe('MoneyUtil', () => {
  describe('formatNumberAsCurrency', () => {
    it('should return string starting unit if exist and having comma every three digit', () => {
      expect(MoneyUtil.convertLocalCurrencyFormat(10000)).toEqual('10,000');
      expect(MoneyUtil.convertLocalCurrencyFormat(10000, { unit: '₩' })).toEqual('₩ 10,000');
      expect(MoneyUtil.convertLocalCurrencyFormat(10000000)).toEqual('10,000,000');
      expect(MoneyUtil.convertLocalCurrencyFormat(123456789, { currency: 'USD' })).toEqual('$123,456,789.00');
      expect(MoneyUtil.convertLocalCurrencyFormat(123456789, { currency: 'JPY' })).toEqual('￥123,456,789');
      expect(MoneyUtil.convertLocalCurrencyFormat(123456789, { currency: 'KRW' })).toEqual('₩123,456,789');
    });
  });
});
