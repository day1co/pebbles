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
      const booleanMap: Map<string, boolean> = new Map([['FALSE', false]]);
      const nullableMap: Map<string, string | null> = new Map([['NULL', null]]);
      const numberMap: Map<string, number> = new Map([['ZERO', 0]]);

      expect(MapUtil.get(booleanMap, 'FALSE', true)).toBe(booleanMap.get('FALSE'));
      expect(MapUtil.get(nullableMap, 'NULL')).toBe(nullableMap.get('NULL'));
      expect(MapUtil.get(numberMap, 'ZERO', 1)).toBe(numberMap.get('ZERO'));
    });
  });
});
