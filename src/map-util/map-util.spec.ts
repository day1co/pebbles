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

    it('should handle special key values correctly', () => {
      const map = new Map<any, string>([
        ['', 'empty string key'],
        [0, 'zero key'],
        [null, 'null key'],
        [undefined, 'undefined key'],
        [NaN, 'NaN key'],
        [false, 'false key']
      ]);

      expect(MapUtil.get(map, '', 'default')).toBe('empty string key');
      expect(MapUtil.get(map, 0, 'default')).toBe('zero key');
      expect(MapUtil.get(map, null, 'default')).toBe('null key');
      expect(MapUtil.get(map, undefined, 'default')).toBe('undefined key');
      expect(MapUtil.get(map, NaN, 'default')).toBe('NaN key');
      expect(MapUtil.get(map, false, 'default')).toBe('false key');
    });

    it('should handle complex objects as keys', () => {
      const obj1 = { id: 1 };
      const obj2 = { id: 2 };
      
      const map = new Map<object, string>([
        [obj1, 'object 1'],
        [obj2, 'object 2']
      ]);

      expect(MapUtil.get(map, obj1, 'default')).toBe('object 1');
      expect(MapUtil.get(map, obj2, 'default')).toBe('object 2');
      expect(MapUtil.get(map, { id: 1 }, 'default')).toBe('default'); // Different object reference
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
        [null, [{ id: 5, name: null }]],
      ]);
      const result = MapUtil.groupByKey(array, 'name');
      expect(result).toEqual(expectedMap);
    });

    it('should return an empty map when given an empty array', () => {
      const array: any[] = [];
      const expectedMap = new Map();
      const result = MapUtil.groupByKey(array, 'name');
      expect(result).toEqual(expectedMap);
    });

    it('should handle objects with missing properties', () => {
      const array = [
        { id: 1, name: 'John' },
        { id: 2 }, // Missing name property
        { id: 3, name: 'Mary' },
      ];
      
      const result = MapUtil.groupByKey(array, 'name');
      
      // Note: The implementation of groupByKey skips items where the key is undefined
      // Verify the map contains only the items with defined keys
      expect(result.size).toBe(2);
      expect(result.has('John')).toBe(true);
      expect(result.has('Mary')).toBe(true);
      expect(result.has(undefined)).toBe(false);
      
      expect(result.get('John')).toEqual([{ id: 1, name: 'John' }]);
      expect(result.get('Mary')).toEqual([{ id: 3, name: 'Mary' }]);
    });

    it('should handle special property values correctly', () => {
      const array = [
        { id: 1, value: '' }, // Empty string
        { id: 2, value: 0 }, // Zero
        { id: 3, value: false }, // False
        { id: 4, value: null }, // Null
        { id: 5, value: undefined }, // Undefined
      ];
      
      const result = MapUtil.groupByKey(array, 'value');
      
      // Verify the map has the correct keys and values
      // Note: undefined values are skipped by the implementation
      expect(result.size).toBe(4);
      expect(result.has('')).toBe(true);
      expect(result.has(0)).toBe(true);
      expect(result.has(false)).toBe(true);
      expect(result.has(null)).toBe(true);
      expect(result.has(undefined)).toBe(false);
      
      expect(result.get('')).toEqual([{ id: 1, value: '' }]);
      expect(result.get(0)).toEqual([{ id: 2, value: 0 }]);
      expect(result.get(false)).toEqual([{ id: 3, value: false }]);
      expect(result.get(null)).toEqual([{ id: 4, value: null }]);
    });
  });

  describe('groupBy', () => {
    it('should group an array of objects by a specified callback', () => {
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
        [null, [{ id: 5, name: null }]],
      ]);
      const result = MapUtil.groupBy(array, (item) => item.name);
      expect(result).toEqual(expectedMap);
    });

    it('should return an empty map when given an empty array', () => {
      const array: any[] = [];
      const expectedMap = new Map();
      const result = MapUtil.groupBy(array, () => 'name');
      expect(result).toEqual(expectedMap);
    });

    it('should skip if callback returns undefined', () => {
      const array = [
        { id: 1, name: 'John' },
        { id: 2, name: 'Jane' },
        { id: 3, name: 'John' },
        { id: 4, name: 'Mary' },
        { id: 5, name: null },
      ];

      const expectedMap = new Map([]);

      const result = MapUtil.groupBy(array, (item) => {
        return (item as any).invalidKey;
      });
      expect(result).toEqual(expectedMap);
    });

    it('should handle complex grouping logic', () => {
      const array = [
        { id: 1, value: 5 },
        { id: 2, value: 10 },
        { id: 3, value: 15 },
        { id: 4, value: 20 },
        { id: 5, value: 25 },
      ];
      
      // Group by value ranges (0-10, 11-20, 21+)
      const result = MapUtil.groupBy(array, (item) => {
        if (item.value <= 10) return 'low';
        if (item.value <= 20) return 'medium';
        return 'high';
      });
      
      const expectedMap = new Map([
        ['low', [
          { id: 1, value: 5 },
          { id: 2, value: 10 }
        ]],
        ['medium', [
          { id: 3, value: 15 },
          { id: 4, value: 20 }
        ]],
        ['high', [
          { id: 5, value: 25 }
        ]],
      ]);
      
      expect(result).toEqual(expectedMap);
    });

    it('should handle transformation in the callback', () => {
      const array = [
        { id: 1, date: new Date('2023-01-01') },
        { id: 2, date: new Date('2023-01-15') },
        { id: 3, date: new Date('2023-02-01') },
        { id: 4, date: new Date('2023-02-15') },
      ];
      
      // Group by month
      const result = MapUtil.groupBy(array, (item) => {
        return item.date.getMonth() + 1; // January = 1, February = 2, etc.
      });
      
      const expectedMap = new Map([
        [1, [
          { id: 1, date: new Date('2023-01-01') },
          { id: 2, date: new Date('2023-01-15') }
        ]],
        [2, [
          { id: 3, date: new Date('2023-02-01') },
          { id: 4, date: new Date('2023-02-15') }
        ]],
      ]);
      
      expect(result).toEqual(expectedMap);
    });
  });
});
