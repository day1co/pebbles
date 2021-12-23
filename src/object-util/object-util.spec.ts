import { ObjectUtil } from './object-util';

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
      expect(ObjectUtil.isEmpty(Buffer.alloc(0))).toBe(true);
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
    });
    it('should throw error', () => {
      const buffer = Buffer.alloc(10);
      expect(() => ObjectUtil.deepClone<Buffer>(buffer)).toThrow();
    });
  });
});
