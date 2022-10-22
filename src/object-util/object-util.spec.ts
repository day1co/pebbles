import { ObjectUtil } from './object-util';
import { ObjectType } from './object-util.type';

describe('ObjectUtil', () => {
  describe('serialize', () => {
    const { serialize } = ObjectUtil;
    it('should return string', () => {
      const obj = { test: 123 };
      const result = serialize(obj);
      expect(typeof result).toBe('string');
    });
    it('should return null for invalid', () => {
      const obj: { test: number; obj?: Record<string, unknown> } = { test: 123 };
      obj.obj = obj;
      const result = serialize(obj);
      expect(result).toBeNull();
    });
  });
  describe('deserialize', () => {
    const { deserialize } = ObjectUtil;
    it('should return object', () => {
      const str = '{ "test": 123 }';
      const result = deserialize(str);
      expect(result).toBeInstanceOf(Object);
    });
    it('should return null for invalid', () => {
      const str = '__invalid__';
      const result = deserialize(str);
      expect(result).toBeNull();
    });
  });
  describe('isNullish', () => {
    const { isNullish } = ObjectUtil;
    it('should return true', () => {
      expect(isNullish(null)).toBe(true);
      expect(isNullish(undefined)).toBe(true);
    });
    it('should return false', () => {
      expect(isNullish(0)).toBe(false);
      expect(isNullish(false)).toBe(false);
      expect(isNullish(true)).toBe(false);
      expect(isNullish(1)).toBe(false);
      expect(isNullish('{"test": 123}')).toBe(false);
    });
  });

  describe('isEmpty', () => {
    const { isEmpty } = ObjectUtil;
    const obj = Object.create(null);
    it('should return true', () => {
      expect(isEmpty(null)).toBe(true);
      expect(isEmpty(undefined)).toBe(true);
      expect(isEmpty(0)).toBe(true);
      expect(isEmpty(1)).toBe(true);
      expect(isEmpty([])).toBe(true);
      expect(isEmpty({})).toBe(true);
      expect(isEmpty('')).toBe(true);
      expect(isEmpty(new Set())).toBe(true);
      expect(isEmpty(new Set([]))).toBe(true);
      expect(isEmpty(new Map())).toBe(true);
      expect(isEmpty(new Date('2021-10-10'))).toBe(true);
      expect(isEmpty(obj)).toBe(true);
    });
    it('should return false', () => {
      expect(isEmpty(['foo'])).toBe(false);
      expect(isEmpty({ length: 0 })).toBe(false);
      expect(isEmpty({ 1: 0 })).toBe(false);
      expect(isEmpty({ foo: { bar: 'baz' } })).toBe(false);
      expect(isEmpty('foo')).toBe(false);
      expect(isEmpty(' ')).toBe(false);
      expect(isEmpty(new Set([1, 2, 3, 'foo', {}]))).toBe(false);
      expect(isEmpty(new Map([['foo', 1]]))).toBe(false);
      // Test for assigning to null object
      obj['id'] = 1;
      expect(isEmpty(obj)).toBe(false);
    });
  });

  describe('deepClone', () => {
    const { deepClone } = ObjectUtil;
    it('should return deep cloned object', () => {
      interface TestInterface {
        foo: Bar;
        baz: number;
      }
      interface Bar {
        bar: number;
      }
      const interfaceObj: TestInterface = { foo: { bar: 1 }, baz: 2 };
      const clonedInterfaceObj = deepClone<TestInterface>(interfaceObj);
      expect(clonedInterfaceObj).not.toBe(interfaceObj);
      expect(clonedInterfaceObj).toEqual(interfaceObj);
      expect(clonedInterfaceObj.foo).not.toBe(interfaceObj.foo);
      expect(clonedInterfaceObj.foo).toEqual(interfaceObj.foo);

      class TestClass {
        private _foo: number;

        constructor(arg: number) {
          this._foo = arg;
        }

        get foo(): number {
          return this._foo;
        }

        set foo(arg: number) {
          this._foo = arg;
        }
      }
      const classObj: TestClass = new TestClass(1);
      const clonedClassObj = deepClone<TestClass>(classObj);
      expect(clonedClassObj instanceof TestClass).toBe(true);
      expect(clonedClassObj).not.toBe(classObj);
      expect(clonedClassObj).toEqual(classObj);

      const array = ['foo', { bar: 1 }, null];
      const clonedArray = deepClone<(string | Bar | null)[]>(array);
      expect(clonedArray).not.toBe(array);
      expect(clonedArray).toEqual(array);
      expect(clonedArray[1]).not.toBe(array[1]);
      expect(clonedArray[1]).toEqual(array[1]);

      const date = new Date();
      const clonedDate = deepClone<Date>(date);
      expect(clonedDate).not.toBe(date);
      expect(clonedDate).toEqual(date);

      const map = new Map<string, number | Bar>();
      map.set('foo', 1);
      map.set('bar', { bar: 2 });
      const clonedMap = deepClone<Map<string, number | Bar>>(map);
      expect(clonedMap).not.toBe(map);
      expect(clonedMap).toEqual(map);
      expect(clonedMap.get('bar')).not.toBe(map.get('bar'));
      expect(clonedMap.get('bar')).toEqual(map.get('bar'));

      const set = new Set<string | { bar: number }>();
      const bar = { bar: 1 };
      set.add('foo');
      set.add(bar);
      const clonedSet = deepClone<Set<string | Bar>>(set);
      expect(clonedSet).not.toBe(set);
      expect(clonedSet).toEqual(set);
      expect(clonedSet.has(bar)).toBe(false);

      type SymbolKeyObj = { [key: symbol]: string };
      const symbolKeyObj: SymbolKeyObj = {};
      const symbol = Symbol('foo');
      symbolKeyObj[symbol] = 'bar';
      const clonedSymbolKey = deepClone<SymbolKeyObj>(symbolKeyObj);
      expect(clonedSymbolKey).not.toBe(symbolKeyObj);
      expect(clonedSymbolKey).toEqual(symbolKeyObj);

      const buf = new ArrayBuffer(16);
      const float64Array = new Float64Array(buf);
      float64Array[0] = 0.5;
      float64Array[1] = 1.5;
      const clonedBuf = deepClone<ArrayBuffer>(buf);
      const clonedFloat64Array = new Float64Array(clonedBuf);
      expect(clonedFloat64Array).not.toBe(float64Array);
      expect(clonedFloat64Array).toEqual(float64Array);

      const func = (value: string) => `test ${value}`;
      const obj = { foo: func };
      const result = 'test bar';
      expect(deepClone(func)('bar')).toBe(result);
      expect(deepClone(obj).foo('bar')).toBe(result);
    });
  });

  describe('merge', () => {
    const { merge } = ObjectUtil;
    it('merge jsons and arrays', () => {
      const obj1 = { foo: [{ bar: 2 }, { qux: 4 }] };
      const obj2 = { foo: [{ baz: 3 }, { quux: 5 }] };
      type SymbolKeyObj = { [key: symbol]: number };
      const obj3: SymbolKeyObj = {};
      const symbol = Symbol('quuz');
      obj3[symbol] = 6;
      const result: ObjectType = {
        foo: [
          { bar: 2, baz: 3 },
          { qux: 4, quux: 5 },
        ],
      };
      result[symbol] = 6;
      expect(merge(obj1, obj2, obj3)).toEqual(result);
    });
    it('merge objects which contain function', () => {
      const obj1 = { foo: 1 };
      const obj2 = { foo: (val: string) => `test ${val}` };
      const mergedObj = merge(obj1, obj2);
      expect(mergedObj.foo('bar')).toBe('test bar');
      expect(merge(obj2, obj1)).toEqual(obj1);
    });
  });

  describe('naive merge', () => {
    const { naiveMerge } = ObjectUtil;

    it('merge plain object with empty target', () => {
      const obj1 = {};
      const obj2 = { foo: { id: 1 } };
      const expected: ObjectType = { foo: { id: 1 } };

      const mergedObj = naiveMerge(obj1, obj2);

      expect(mergedObj).toEqual(expected);
    });
    it('merge plain array object with empty target', () => {
      const obj1 = {};
      const obj2 = { foo: [{ id: 1 }] };
      const expected: ObjectType = { foo: [{ id: 1 }] };

      const mergedObj = naiveMerge(obj1, obj2);

      expect(mergedObj).toEqual(expected);
    });
    it('merge array object naively', () => {
      const obj1 = { foo: [{ id: 1 }] };
      const obj2 = { foo: [{ id: 2 }] };
      const expected: ObjectType = { foo: [{ id: 1 }, { id: 2 }] };

      const mergedObj = naiveMerge(obj1, obj2);

      expect(mergedObj).toEqual(expected);
    });
    it('merge nested array object naively', () => {
      const obj1 = { foo: { bar: [{ id: 3 }] } };
      const obj2 = { foo: { bar: [{ id: 4 }] } };
      const expected = { foo: { bar: [{ id: 3 }, { id: 4 }] } };

      const mergedObj = naiveMerge(obj1, obj2);

      expect(mergedObj).toEqual(expected);
    });
    it('merge multi nested array object naively', () => {
      const obj1 = { foo: { bar: { qux: [{ id: 5 }] } } };
      const obj2 = { foo: { bar: { qux: [{ id: 6 }] } } };
      const expected = { foo: { bar: { qux: [{ id: 5 }, { id: 6 }] } } };

      const mergedObj = naiveMerge(obj1, obj2);

      expect(mergedObj).toEqual(expected);
    });
    it('merge multi nested array object for non array property', () => {
      const obj1 = { foo: { bar: { qux: { id: 5 } } } };
      const obj2 = { foo: { bar: { qux: [{ id: 6 }] } } };
      const expected = { foo: { bar: { qux: [{ id: 5 }, { id: 6 }] } } };

      const mergedObj = naiveMerge(obj1, obj2);

      expect(mergedObj).toEqual(expected);
    });
    it('merge multi nested array object without drop anything', () => {
      const obj1 = { foo: { bar: { qux: { id: 5 } } } };
      const obj2 = { foo: { bar: { qux: { id: 6 } } } };
      const expected = { foo: { bar: { qux: { id: [5, 6] } } } };

      const mergedObj = naiveMerge(obj1, obj2);

      expect(mergedObj).toEqual(expected);
    });
  });

  describe('leaner merge', () => {
    const { linearMerge } = ObjectUtil;

    it('merge object linear with empty object', () => {
      const arr1 = ['foo', 'bar', 'baz'];
      const leaf = {};
      const expected = { foo: { bar: { baz: {} } } };

      const mergedObj = linearMerge(arr1, leaf);

      expect(mergedObj).toEqual(expected);
    });
    it('merge object linear with plain object ', () => {
      const arr1 = ['foo', 'bar', 'baz'];
      const leaf = { id: 1 };
      const expected = { foo: { bar: { baz: leaf } } };

      const mergedObj = linearMerge(arr1, { id: 1 });

      expect(mergedObj).toEqual(expected);
    });
    it('merge object linear with array leaf', () => {
      const arr1 = ['foo', 'bar', 'baz'];
      const leaf = [1];
      const expected = { foo: { bar: { baz: [1] } } };

      const mergedObj = linearMerge(arr1, leaf);

      expect(mergedObj).toEqual(expected);
    });
    it('merge object linear with nested array object leaf', () => {
      const arr1 = ['foo', 'bar', 'baz'];
      const leaf = { id: [1] };
      const expected = { foo: { bar: { baz: { id: [1] } } } };

      const mergedObj = linearMerge(arr1, leaf);

      expect(mergedObj).toEqual(expected);
    });
    it('merge object linear with nested primitive leaf', () => {
      const arr1 = ['foo', 'bar', 'baz'];
      const leaf = 'hello world';
      const expected = { foo: { bar: { baz: 'hello world' } } };

      const mergedObj = linearMerge(arr1, leaf);

      expect(mergedObj).toEqual(expected);
    });
  });

  describe('omit', () => {
    const { omit } = ObjectUtil;

    it('should return object with given keys deleted', () => {
      const testObj1 = { foo: 1, bar: 2, baz: 3 };
      const testObj2 = { foo: 1, bar: 2, baz: { foo: 1, bar: 2 } };
      const testObj3 = { foo: 1, bar: 2, baz: [1, 2, 3] };
      expect(omit(testObj1, ['foo', 'bar'])).toEqual({ baz: 3 });
      expect(omit(testObj2, ['baz'])).toEqual({ foo: 1, bar: 2 });
      expect(omit(testObj3, ['baz'])).toEqual({ foo: 1, bar: 2 });
      expect(omit(testObj1, ['qux', 'bar'])).toEqual({ foo: 1, baz: 3 });
    });

    it('should delete object keys flattened', () => {
      const testObj1 = { foo: 1, bar: 2, baz: { foo: 1, bar: 2 } };
      const testObj2 = { foo: 1, bar: 2, baz: { foo: [1, 2], bar: { foo: 1, bar: 2 } } };
      expect(omit(testObj1, ['baz.foo'])).toEqual({ foo: 1, bar: 2, baz: { bar: 2 } });
      expect(omit(testObj2, ['foo', 'baz.bar.bar'])).toEqual({
        bar: 2,
        baz: { foo: [1, 2], bar: { foo: 1 } },
      });
    });

    it('should not deform original object', () => {
      const testObj1 = { foo: 1, bar: 2 };
      const testObj2 = { foo: 1, bar: 2, baz: { foo: 1, bar: 2, baz: { foo: 1, bar: 2 } } };
      const testResult1 = omit(testObj1, ['bar']);
      const testResult2 = omit(testObj2, ['bar', 'baz.foo', 'baz.baz.bar']);
      expect(testObj1).toEqual({ foo: 1, bar: 2 });
      expect(testObj2).toEqual({ foo: 1, bar: 2, baz: { foo: 1, bar: 2, baz: { foo: 1, bar: 2 } } });
      expect(testObj1).not.toEqual(testResult1);
      expect(testObj2).not.toEqual(testResult2);
    });

    it('should omit with number | symbol type key', () => {
      const symbol1 = Symbol('foo');
      const symbol2 = Symbol('bar');
      const testObj1: { [key: symbol]: number } = {};
      const testObj2: { [key: number]: number } = {};
      testObj1[symbol1] = 1;
      testObj1[symbol2] = 2;

      const number1 = 1;
      const number2 = 2;
      testObj2[number1] = 1;
      testObj2[number2] = 2;

      expect(omit(testObj1, [symbol1])).toEqual({ [symbol2]: 2 });
      expect(omit(testObj2, [1])).toEqual({ [2]: 2 });
    });

    it('should return array without indices to omit', () => {
      const testArray1 = ['foo', 'bar', { baz: 'qux' }];
      const testArray2 = ['foo', { bar: ['baz'] }];
      expect(omit(testArray1, [0, 2])).toEqual(['bar']);
      expect(omit(testArray2, ['1.bar.0'])).toEqual(['foo', { bar: [] }]);
    });

    it('should skip with key which does not exist', () => {
      const testObj1 = { foo: 1, bar: 2 };
      const testObj2 = { foo: 1, bar: { foo: 1, bar: { foo: 1, bar: 2 } } };
      const testObj3 = { [Symbol('foo')]: 1 };
      const testObj4 = { [1]: 1, [2]: 2 };
      expect(omit(testObj1, ['bar.foo.bar'])).toEqual(testObj1);
      expect(omit(testObj2, ['bar.bar', 'bar.bar'])).toEqual({ foo: 1, bar: { foo: 1 } });
      expect(omit(testObj3, [Symbol('bar')])).toEqual(testObj3);
      expect(omit(testObj4, [3])).toEqual(testObj4);
    });

    it('should return obj as a new object when one of two parameters is empty', () => {
      const testObj1 = {};
      const testObj2 = new Map();
      const testObj3 = new Set();
      expect(omit(testObj1, ['foo'])).toEqual({});
      expect(omit(testObj1, ['foo'])).not.toBe(testObj1);
      expect(omit(testObj2, ['foo'])).toEqual(new Map());
      expect(omit(testObj2, ['foo'])).not.toBe(testObj2);
      expect(omit(testObj3, ['foo'])).toEqual(new Set());
      expect(omit(testObj3, ['foo'])).not.toBe(testObj3);
    });

    it('should return obj with deleted keys with undefined value', () => {
      const testObj = { foo: undefined };
      expect(omit(testObj, ['foo'])).toEqual({});
    });
  });

  describe('getAllPropertyKeys', () => {
    const { getAllPropertyKeys } = ObjectUtil;
    it('should return true', () => {
      const symbol = Symbol('bar');
      const obj: { [key: string | symbol]: unknown } = { foo: 1 };
      obj[symbol] = 'baz';
      expect(getAllPropertyKeys(obj)).toEqual(['foo', symbol]);
      expect(getAllPropertyKeys(['foo', 'bar', 'baz'])).toEqual(['0', '1', '2', 'length']);
    });
  });

  describe('isEqual', () => {
    const { isEqual } = ObjectUtil;
    it('should return true', () => {
      expect(isEqual({ foo: 1 }, { foo: 1 })).toBe(true);
      expect(isEqual({ foo: { bar: 'baz' } }, { foo: { bar: 'baz' } })).toBe(true);
      expect(isEqual({}, {})).toBe(true);
      expect(isEqual([], [])).toBe(true);
      expect(isEqual([null], [null])).toBe(true);
      expect(isEqual(new Set([1, 2, 3]), new Set([3, 2, 1]))).toBe(true);
      expect(isEqual([new Set([1, 2, 3, 'foo', {}])], [new Set([1, 2, 3, 'foo', {}])])).toBe(true);
      expect(isEqual([new Date(2021, 5, 23)], [new Date(2021, 5, 23)])).toBe(true);
      expect(isEqual(new Set([1, 2, 3, 'foo', {}]), new Set([1, 2, 3, 'foo', {}]))).toBe(true);
      expect(isEqual(new Map(), new Map())).toBe(true);
      expect(isEqual(new RegExp('ab+c'), new RegExp('ab+c'))).toBe(true);
    });

    it('should return false', () => {
      expect(isEqual(new RegExp('ab+c'), new RegExp('ab+d'))).toBe(false);
      expect(isEqual({ foo: 1 }, { foo: 2 })).toBe(false);
      expect(isEqual({ one: 1, two: 2 }, { one: 1, two: 2, three: 3 })).toBe(false);
      expect(isEqual([1, 2], [1, 2, 3])).toBe(false);
      expect(isEqual([undefined], [null])).toBe(false);
      expect(isEqual([], {})).toBe(false);
      expect(isEqual([new Date(2021, 5, 23)], [new Date(2021, 3, 23)])).toBe(false);
      expect(isEqual([new Set([1, { a: new Set([1, {}]) }])], [new Set([1, { a: new Set([1, []]) }])])).toBe(false);
      expect(isEqual(new Map([['foo', { a: 'foo' }]]), new Map([['foo', { a: 'bar' }]]))).toBe(false);
      function fn(str: string) {
        return str;
      }
      expect(isEqual({ foo: fn('a') }, { foo: fn('b') })).toBe(false);
      const symbol = Symbol('a');
      expect(isEqual({ [symbol]: { a: 'foo' } }, { [symbol]: { a: 'bar' } })).toBe(false);
    });
  });

  describe('pick', () => {
    const { pick } = ObjectUtil;
    it('should return picked object', () => {
      expect(pick({ foo: 1, bar: '2', baz: 3 }, ['foo', 'bar'])).toEqual({ foo: 1, bar: '2' });
      expect(pick({ foo: 1 }, ['bar'])).toEqual({});
      expect(pick({ foo: 1 }, [])).toEqual({});
      expect(pick({ foo: 1, bar: '2', baz: { foo: 3, bar: 4, baz: 5 } }, ['foo', 'baz', 'qux'])).toEqual({
        foo: 1,
        baz: { foo: 3, bar: 4, baz: 5 },
      });
      expect(pick(['foo', 2, { bar: 3 }], [0, 1, 2, 3])).toEqual({ 0: 'foo', 1: 2, 2: { bar: 3 } });
    });
  });
});
