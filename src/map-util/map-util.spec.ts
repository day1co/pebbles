import { MapUtil } from './map-util';

describe('MapUtil', () => {
  describe('get', () => {
    it('should return defaultValue', () => {
      expect(MapUtil.get(new Map(), 1, 'value')).toBe('value');
    });

    it('should omit defaultValue', () => {
      expect(MapUtil.get(new Map(), 1)).toBeUndefined();
    });

    it('should return existing value', () => {
      const booleanMap = new Map([['FALSE', false]]);
      const nullableMap = new Map([['NULL', null]]);
      const integerMap = new Map([['ZERO', 0]]);

      expect(MapUtil.get(booleanMap, 'FALSE', 'invalid')).toBe(booleanMap.get('FALSE'));
      expect(MapUtil.get(nullableMap, 'NULL', 'invalid')).toBe(nullableMap.get('NULL'));
      expect(MapUtil.get(integerMap, 'ZERO', 'invalid')).toBe(integerMap.get('ZERO'));
    });
  });
});
