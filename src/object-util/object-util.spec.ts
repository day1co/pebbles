import { ObjectUtil } from './object-util';
import { ObjectType } from './object-util.type';

describe('ObjectUtil', () => {
  describe('serialize', () => {
    it('should return string', async () => {
      const obj = { test: 123 };
      const result = ObjectUtil.serialize(obj);
      expect(typeof result).toBe('string');
    });
    it('should return null for invalid', async () => {
      const obj: { test: number; obj?: Record<string, unknown> } = { test: 123 };
      obj.obj = obj;
      const result = ObjectUtil.serialize(obj);
      expect(result).toBeNull();
    });
  });
  describe('deserialize', () => {
    it('should return object', async () => {
      const str = '{ "test": 123 }';
      const result = ObjectUtil.deserialize(str);
      expect(result).toBeInstanceOf(Object);
    });
    it('should return null for invalid', async () => {
      const str = '__invalid__';
      const result = ObjectUtil.deserialize(str);
      expect(result).toBeNull();
    });
  });
  describe('isNullish', () => {
    it('should return true', () => {
      expect(ObjectUtil.isNullish(null)).toBe(true);
      expect(ObjectUtil.isNullish(undefined)).toBe(true);
    });
    it('should return false', () => {
      expect(ObjectUtil.isNullish(0)).toBe(false);
      expect(ObjectUtil.isNullish(false)).toBe(false);
      expect(ObjectUtil.isNullish(true)).toBe(false);
      expect(ObjectUtil.isNullish(1)).toBe(false);
      expect(ObjectUtil.isNullish('{"test": 123}')).toBe(false);
    });
  });

  describe('isEmpty', () => {
    it('should return true', async () => {
      expect(ObjectUtil.isEmpty(null)).toBe(true);
      expect(ObjectUtil.isEmpty(undefined)).toBe(true);
      expect(ObjectUtil.isEmpty(0)).toBe(true);
      expect(ObjectUtil.isEmpty(1)).toBe(true);
      expect(ObjectUtil.isEmpty([])).toBe(true);
      expect(ObjectUtil.isEmpty({})).toBe(true);
      expect(ObjectUtil.isEmpty('')).toBe(true);
      expect(ObjectUtil.isEmpty(new Set())).toBe(true);
      expect(ObjectUtil.isEmpty(new Set([]))).toBe(true);
      expect(ObjectUtil.isEmpty(new Map())).toBe(true);
      expect(ObjectUtil.isEmpty(new Date('2021-10-10'))).toBe(true);
    });
    it('should return false', async () => {
      expect(ObjectUtil.isEmpty(['foo'])).toBe(false);
      expect(ObjectUtil.isEmpty({ length: 0 })).toBe(false);
      expect(ObjectUtil.isEmpty({ 1: 0 })).toBe(false);
      expect(ObjectUtil.isEmpty({ foo: { bar: 'baz' } })).toBe(false);
      expect(ObjectUtil.isEmpty('foo')).toBe(false);
      expect(ObjectUtil.isEmpty(' ')).toBe(false);
      expect(ObjectUtil.isEmpty(new Set([1, 2, 3, 'foo', {}]))).toBe(false);
      expect(ObjectUtil.isEmpty(new Map([['foo', 1]]))).toBe(false);
    });
  });

  describe('deepClone', () => {
    it('should return deep cloned object', () => {
      interface TestInterface {
        foo: Bar;
        baz: number;
      }
      interface Bar {
        bar: number;
      }
      const interfaceObj: TestInterface = { foo: { bar: 1 }, baz: 2 };
      const clonedInterfaceObj = ObjectUtil.deepClone<TestInterface>(interfaceObj);
      expect(clonedInterfaceObj).not.toBe(interfaceObj);
      expect(clonedInterfaceObj).toEqual(interfaceObj);

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
      const clonedClassObj = ObjectUtil.deepClone<TestClass>(classObj);
      expect(clonedClassObj instanceof TestClass).toBe(true);
      expect(clonedClassObj).not.toBe(classObj);
      expect(clonedClassObj).toEqual(classObj);

      const array = ['foo', { bar: 1 }];
      const clonedArray = ObjectUtil.deepClone<(string | Bar)[]>(array);
      expect(clonedArray instanceof Array).toBe(true);
      expect(clonedArray).not.toBe(array);
      expect(clonedArray).toEqual(array);

      const date = new Date();
      const clonedDate = ObjectUtil.deepClone<Date>(date);
      expect(clonedDate instanceof Date).toBe(true);
      expect(clonedDate).not.toBe(date);
      expect(clonedDate).toEqual(date);

      const map = new Map<string, number | Bar>();
      map.set('foo', 1);
      map.set('bar', { bar: 2 });
      const clonedMap = ObjectUtil.deepClone<Map<string, number | Bar>>(map);
      expect(clonedMap instanceof Map).toBe(true);
      expect(clonedMap).not.toBe(map);
      expect(clonedMap).toEqual(map);

      const set = new Set<string | { bar: number }>();
      set.add('foo');
      set.add({ bar: 1 });
      const clonedSet = ObjectUtil.deepClone<Set<string | Bar>>(set);
      expect(clonedSet instanceof Set).toBe(true);
      expect(clonedSet).not.toBe(set);
      expect(clonedSet).toEqual(set);

      type SymbolKeyObj = { [key: symbol]: string };
      const symbolKeyObj: SymbolKeyObj = {};
      const symbol = Symbol('foo');
      symbolKeyObj[symbol] = 'bar';
      const clonedSymbolKey = ObjectUtil.deepClone<SymbolKeyObj>(symbolKeyObj);
      expect(clonedSymbolKey).not.toBe(symbolKeyObj);
      expect(clonedSymbolKey).toEqual(symbolKeyObj);
    });
  });

  describe('merge', () => {
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
      expect(ObjectUtil.merge(obj1, obj2, obj3)).toEqual(result);
    });
  });

  describe('omit', () => {
    interface TestObj {
      foo: 1;
      bar: 2;
      baz?: unknown;
    }

    it('should return object with given keys deleted', () => {
      const testObj1: TestObj = { foo: 1, bar: 2, baz: 3 };
      const testObj2: TestObj = { foo: 1, bar: 2, baz: { foo: 1, bar: 2 } };
      const testObj3: TestObj = { foo: 1, bar: 2, baz: [1, 2, 3] };
      expect(ObjectUtil.omit(testObj1, ['foo', 'bar'])).toEqual({ baz: 3 });
      expect(ObjectUtil.omit(testObj2, ['baz'])).toEqual({ foo: 1, bar: 2 });
      expect(ObjectUtil.omit(testObj3, ['baz'])).toEqual({ foo: 1, bar: 2 });
    });

    it('should delete object keys flattened', () => {
      const testObj1: TestObj = { foo: 1, bar: 2, baz: { foo: 1, bar: 2 } };
      const testObj2: TestObj = { foo: 1, bar: 2, baz: { foo: [1, 2], bar: { foo: 1, bar: 2 } } };
      expect(ObjectUtil.omit(testObj1, ['baz.foo'])).toEqual({ foo: 1, bar: 2, baz: { bar: 2 } });
      expect(ObjectUtil.omit(testObj2, ['foo', 'baz.bar.bar'])).toEqual({
        bar: 2,
        baz: { foo: [1, 2], bar: { foo: 1 } },
      });
    });

    it('should not deform original object', () => {
      const testObj1: TestObj = { foo: 1, bar: 2 };
      const testObj2: TestObj = { foo: 1, bar: 2, baz: { foo: 1, bar: 2, baz: { foo: 1, bar: 2 } } };
      const testResult1 = ObjectUtil.omit(testObj1, ['bar']);
      const testResult2 = ObjectUtil.omit(testObj2, ['bar', 'baz.foo', 'baz.baz.bar']);
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

      expect(ObjectUtil.omit(testObj1, [symbol1])).toEqual({ [symbol2]: 2 });
      expect(ObjectUtil.omit(testObj2, [1])).toEqual({ [2]: 2 });
    });

    it('should skip with key which does not exist', () => {
      const testObj1 = { foo: 1, bar: 2 };
      const testObj2 = { foo: 1, bar: { foo: 1, bar: { foo: 1, bar: 2 } } };
      const testObj3 = { [Symbol('foo')]: 1 };
      const testObj4 = { [1]: 1, [2]: 2 };
      expect(ObjectUtil.omit(testObj1, ['bar.foo.bar'])).toEqual(testObj1);
      expect(ObjectUtil.omit(testObj2, ['bar.bar', 'bar.bar'])).toEqual({ foo: 1, bar: { foo: 1 } });
      expect(ObjectUtil.omit(testObj3, [Symbol('bar')])).toEqual(testObj3);
      expect(ObjectUtil.omit(testObj4, [3])).toEqual(testObj4);
    });

    it('should return obj as a new object when one of two parameters is empty', () => {
      const testObj1 = {};
      const testObj2 = new Map();
      const testObj3 = new Set();
      expect(ObjectUtil.omit(testObj1, ['foo'])).toEqual({});
      expect(ObjectUtil.omit(testObj1, ['foo'])).not.toBe(testObj1);
      expect(ObjectUtil.omit(testObj2, ['foo'])).toEqual(new Map());
      expect(ObjectUtil.omit(testObj2, ['foo'])).not.toBe(testObj2);
      expect(ObjectUtil.omit(testObj3, ['foo'])).toEqual(new Set());
      expect(ObjectUtil.omit(testObj3, ['foo'])).not.toBe(testObj3);
    });
  });

  describe('getAllPropertyKeys', () => {
    it('should return true', async () => {
      const symbol = Symbol('bar');
      const obj: { [key: string | symbol]: unknown } = { foo: 1 };
      obj[symbol] = 'baz';
      expect(ObjectUtil.getAllPropertyKeys(obj)).toEqual(['foo', symbol]);
      expect(ObjectUtil.getAllPropertyKeys(['foo', 'bar', 'baz'])).toEqual(['0', '1', '2', 'length']);
    });
  });

  describe('isEqual', () => {
    it('should return true', async () => {
      expect(ObjectUtil.isEqual({ foo: 1 }, { foo: 1 })).toBe(true);
      expect(ObjectUtil.isEqual({ foo: { bar: 'baz' } }, { foo: { bar: 'baz' } })).toBe(true);
      expect(ObjectUtil.isEqual({}, {})).toBe(true);
      expect(ObjectUtil.isEqual([], [])).toBe(true);
      expect(ObjectUtil.isEqual([null], [null])).toBe(true);
      expect(ObjectUtil.isEqual(new Set([1, 2, 3]), new Set([3, 2, 1]))).toBe(true);
      expect(ObjectUtil.isEqual([new Set([1, 2, 3, 'foo', {}])], [new Set([1, 2, 3, 'foo', {}])])).toBe(true);
      expect(ObjectUtil.isEqual([new Date(2021, 5, 23)], [new Date(2021, 5, 23)])).toBe(true);
      expect(ObjectUtil.isEqual(new Set([1, 2, 3, 'foo', {}]), new Set([1, 2, 3, 'foo', {}]))).toBe(true);
      expect(ObjectUtil.isEqual(new Map(), new Map())).toBe(true);
      expect(ObjectUtil.isEqual(new RegExp('ab+c'), new RegExp('ab+c'))).toBe(true);
    });

    it('should return false', async () => {
      expect(ObjectUtil.isEqual(new RegExp('ab+c'), new RegExp('ab+d'))).toBe(false);
      expect(ObjectUtil.isEqual({ foo: 1 }, { foo: 2 })).toBe(false);
      expect(ObjectUtil.isEqual({ one: 1, two: 2 }, { one: 1, two: 2, three: 3 })).toBe(false);
      expect(ObjectUtil.isEqual([1, 2], [1, 2, 3])).toBe(false);
      expect(ObjectUtil.isEqual([undefined], [null])).toBe(false);
      expect(ObjectUtil.isEqual([], {})).toBe(false);
      expect(ObjectUtil.isEqual([new Date(2021, 5, 23)], [new Date(2021, 3, 23)])).toBe(false);
      expect(ObjectUtil.isEqual([new Set([1, { a: new Set([1, {}]) }])], [new Set([1, { a: new Set([1, []]) }])])).toBe(
        false
      );
      expect(ObjectUtil.isEqual(new Map([['foo', { a: 'foo' }]]), new Map([['foo', { a: 'bar' }]]))).toBe(false);
      function fn(str: string) {
        return str;
      }
      expect(ObjectUtil.isEqual({ foo: fn('a') }, { foo: fn('b') })).toBe(false);
      const symbol = Symbol('a');
      expect(ObjectUtil.isEqual({ [symbol]: { a: 'foo' } }, { [symbol]: { a: 'bar' } })).toBe(false);
    });
  });
});
