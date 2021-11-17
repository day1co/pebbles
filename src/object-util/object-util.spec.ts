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
    it('should return true', async () => {
      const value = null;
      const result = ObjectUtil.isNullish(value);
      expect(result).toBe(true);
    });
    it('should return true', async () => {
      const value = undefined;
      const result = ObjectUtil.isNullish(value);
      expect(result).toBe(true);
    });
    it('should return false', async () => {
      const value = 0;
      const result = ObjectUtil.isNullish(value);
      expect(result).toBe(false);
    });
    it('should return false', async () => {
      const value = false;
      const result = ObjectUtil.isNullish(value);
      expect(result).toBe(false);
    });
    it('should return false', async () => {
      const value = true;
      const result = ObjectUtil.isNullish(value);
      expect(result).toBe(false);
    });
    it('should return false', async () => {
      const value = 1;
      const result = ObjectUtil.isNullish(value);
      expect(result).toBe(false);
    });
    it('should return false', async () => {
      const value = '{"test": 123}';
      const result = ObjectUtil.isNullish(value);
      expect(result).toBe(false);
    });
  });
});
