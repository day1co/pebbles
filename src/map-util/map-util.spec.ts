import { groupBy, groupByKey } from './map-util';

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
    const result = groupBy(array, item => item.name);
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

  const result = groupBy(array, item => {
    return (item as any).invalidKey;
  });
  expect(result).toEqual(expectedMap);
});
