import {
  sha256,
  createRandomBytes,
  createAesKey,
  encodeBase64,
  decodeBase64,
  encodeSeedString,
  decodeSeedString,
} from './crypto-util';

describe('sha256', () => {
  it('should return a promise', async () => {
    const result = await sha256('hello world');
    expect(result).toBeInstanceOf(Uint8Array);
    expect(result).toEqual(
      new Uint8Array([
        185, 77, 39, 185, 147, 77, 62, 8, 165, 46, 82, 215, 218, 125, 171, 250, 196, 132, 239, 227,
        122, 83, 128, 238, 144, 136, 247, 172, 226, 239, 205, 233,
      ])
    );
  });
});

describe('createRandomBytes', () => {
  it('should return a Uint8Array', () => {
    const result = createRandomBytes(32);
    expect(result).toBeInstanceOf(Uint8Array);
    expect(result.length).toBe(32);
  });
});

describe('createAesKey', () => {
  it('should return a Uint8Array', async () => {
    const result = await createAesKey(256);
    expect(result).toBeInstanceOf(Uint8Array);
    expect(result.length).toBe(32);
  });
});

describe('encodeBase64', () => {
  it('should accept string and return a base64 encoded string', () => {
    const result = encodeBase64('hello world');
    expect(result).toBe('aGVsbG8gd29ybGQ=');
  });
  it('should accept Uint8Array and return a base64 encoded string', () => {
    const data = new TextEncoder().encode('hello world');
    const result = encodeBase64(data);
    expect(result).toBe('aGVsbG8gd29ybGQ=');
  });
});

describe('decodeBase64', () => {
  it('should return a Uint8Array', () => {
    const data = 'aGVsbG8gd29ybGQ=';
    const result = decodeBase64(data);
    expect(result).toEqual(new TextEncoder().encode('hello world'));
  });

  describe('ezwelSeed', () => {
    const decrypted = '{"code": "hello world", "message": "안녕하세요"}';
    const encrypted =
      'LUPvDxmJToRCZcl56a7j+b1X1NV+6PMiBLm7SkLALDqyIfqCsHla0jkDuzoIn60GV5BA1t22DaHs1L32r4uw+A==';
    const seedKey = 'string_x_sixteen';

    it('should return encrypted string', () => {
      const r1 = encodeSeedString(decrypted, { seedKey });
      expect(r1).toEqual(encrypted);
    });

    it('should return decrypted string', () => {
      const r1 = decodeSeedString(encrypted, { seedKey });
      expect(r1).toEqual(decrypted);
      expect(JSON.parse(r1)).toEqual(JSON.parse(decrypted));
    });
  });
});
