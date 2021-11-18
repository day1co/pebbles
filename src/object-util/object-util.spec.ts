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
});
