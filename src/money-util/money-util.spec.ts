import { MoneyUtil } from './money-util';

describe('MoneyUtil', () => {
  describe('formatNumberAsCurrency', () => {
    it('should return string starting unit if exist and having comma every three digit', () => {
      expect(MoneyUtil.formatNumberAsCurrency(10000)).toEqual('10,000');
      expect(MoneyUtil.formatNumberAsCurrency(10000, '₩')).toEqual('₩ 10,000');
      expect(MoneyUtil.formatNumberAsCurrency(10000000)).toEqual('10,000,000');
    });
  });
});
