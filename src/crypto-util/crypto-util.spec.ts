import { CryptoUtil } from './crypto-util';

describe('CryptoUtil', () => {
  describe('sha256', () => {
    it('should return a promise', async () => {
      const result = await CryptoUtil.sha256('hello world');
      expect(result).toBeInstanceOf(Uint8Array);
      expect(result).toEqual(
        new Uint8Array([
          185, 77, 39, 185, 147, 77, 62, 8, 165, 46, 82, 215, 218, 125, 171, 250, 196, 132, 239, 227, 122, 83, 128, 238,
          144, 136, 247, 172, 226, 239, 205, 233,
        ])
      );
    });
  });

  describe('createRandomBytes', () => {
    it('should return a Uint8Array', () => {
      const result = CryptoUtil.createRandomBytes(32);
      expect(result).toBeInstanceOf(Uint8Array);
      expect(result.length).toBe(32);
    });
  });

  describe('encodeBase64', () => {
    it('should accept string and return a base64 encoded string', () => {
      const result = CryptoUtil.encodeBase64('hello world');
      expect(result).toBe('aGVsbG8gd29ybGQ=');
    });
    it('should accept Uint8Array and return a base64 encoded string', () => {
      const data = new TextEncoder().encode('hello world');
      const result = CryptoUtil.encodeBase64(data);
      expect(result).toBe('aGVsbG8gd29ybGQ=');
    });
  });

  describe('decodeBase64', () => {
    it('should return a Uint8Array', () => {
      const data = 'aGVsbG8gd29ybGQ=';
      const result = CryptoUtil.decodeBase64(data);
      expect(result).toEqual(new TextEncoder().encode('hello world'));
    });
  });
});
