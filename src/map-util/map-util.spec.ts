import { getMapValue, groupBy, groupByKey } from './map-util';

describe('getMapValue', () => {
  it('should return defaultValue', () => {
    expect(getMapValue(new Map(), 1, 'value')).toBe('value');
  });

  it('should omit defaultValue', () => {
    expect(getMapValue(new Map(), 1)).toBeUndefined();
  });

  it('should return existing value', () => {
    const booleanMap: Map<string, boolean> = new Map([['FALSE', false]]);
    const nullableMap: Map<string, string | null> = new Map([['NULL', null]]);
    const numberMap: Map<string, number> = new Map([['ZERO', 0]]);

    expect(getMapValue(booleanMap, 'FALSE', true)).toBe(booleanMap.get('FALSE'));
    expect(getMapValue(nullableMap, 'NULL')).toBe(nullableMap.get('NULL'));
    expect(getMapValue(numberMap, 'ZERO', 1)).toBe(numberMap.get('ZERO'));
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
    const result = groupByKey(array, 'name');
    expect(result).toEqual(expectedMap);
  });

  it('should return an empty map when given an empty array', () => {
    const array: any[] = [];
    const expectedMap = new Map();
    const result = groupByKey(array, 'name');
    expect(result).toEqual(expectedMap);
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
    const result = groupBy(array, (item) => item.name);
    expect(result).toEqual(expectedMap);
  });
});

it('should return an empty map when given an empty array', () => {
  const array: any[] = [];
  const expectedMap = new Map();
  const result = groupBy(array, () => 'name');
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

  const result = groupBy(array, (item) => {
    return (item as any).invalidKey;
  });
  expect(result).toEqual(expectedMap);
});
