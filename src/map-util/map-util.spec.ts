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

  describe('groupByKey', () => {
    test('should group an array of objects by a specified key', () => {
      const array = [
        { id: 1, name: 'John' },
        { id: 2, name: 'Jane' },
        { id: 3, name: 'John' },
        { id: 4, name: 'Mary' },
        { id: 5, name: null },
      ];
      const expectedMap = new Map([
        [
          'John',
          [
            { id: 1, name: 'John' },
            { id: 3, name: 'John' },
          ],
        ],
        ['Jane', [{ id: 2, name: 'Jane' }]],
        ['Mary', [{ id: 4, name: 'Mary' }]],
      ]);
      const result = MapUtil.groupByKey(array, 'name');
      expect(result).toEqual(expectedMap);
    });

    test('should return an empty map when given an empty array', () => {
      // @ts-ignore
      const array = [];
      const expectedMap = new Map();
      // @ts-ignore
      const result = MapUtil.groupByKey(array, 'name');
      expect(result).toEqual(expectedMap);
    });
  });
});
