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
      expect(ObjectUtil.isEmpty(Buffer.alloc(1))).toBe(false);
    });
  });

  describe('deepClone', () => {
    it('should return deep cloned object', () => {
      const obj = {
        a: 1,
        b: {
          c: 2,
        },
      };
      const clonedObj = ObjectUtil.deepClone(obj);
      expect(clonedObj).not.toBe(obj);
    });
  });
});
