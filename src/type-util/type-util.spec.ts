import { TypeUtil } from './type-util';

describe('TypeUtil', () => {
  describe('makeLiteralTypeList', () => {
    const { makeLiteralTypeList } = TypeUtil;
    it('should return array', () => {
      expect(makeLiteralTypeList('foo', 'bar', 'baz', 'qux', 'quux')).toEqual(['foo', 'bar', 'baz', 'qux', 'quux']);
      expect(makeLiteralTypeList(1, 3, 2, 4, 5)).toEqual([1, 3, 2, 4, 5]);
      expect(makeLiteralTypeList('foo', 1, 'bar', 2, undefined)).toEqual(['foo', 1, 'bar', 2, undefined]);
    });
  });
});
