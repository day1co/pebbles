import { JsonWebToken as jwt } from './json-web-token';

describe('JsonWebToken', () => {
  it('generate token', () => {
    const key = 'key';
    const options = { header: { alg: 'HS256', typ: 'JWT' } };
    const payload = {
      t1: 't1',
      t2: 't2',
    };
    const token = jwt.createJwt(key, payload, options);
    const len = token.split('.').length;

    expect(typeof token).toBe('string');
    expect(len).toBe(3);
  });
  describe('verify token', () => {
    it('should return payload for token', () => {
      const key = 'key';
      const payload = {
        t1: 't1',
        t2: 't2',
      };
      const token = jwt.createJwt(key, payload);
      const result = jwt.verifyJwt(token, key);

      expect(result).toMatchObject(payload);
    });
    it('should return invalid for wrong key', () => {
      try {
        const key = 'key';
        const wrong_key = 'wrong_key';
        const payload = {
          t1: 't1',
          t2: 't2',
        };
        const token = jwt.createJwt(key, payload);
        jwt.verifyJwt(token, wrong_key);
      } catch (exception) {
        //ts v4.4 부터 exception object가 unknown type으로 정의
        if (exception instanceof Error) {
          expect(exception.message).toBe('invalid signature');
        }
      }
    });
  });
  describe('decode token', () => {
    it('should return header and payload for decode', () => {
      const key = 'key';
      const header = { alg: 'HS256', typ: 'JWT' };
      const payload = {
        t1: 't1',
        t2: 't2',
      };
      const token = jwt.createJwt(key, payload);
      const result = jwt.decodeJwt(token);

      expect(result!.header).toMatchObject(header);
      expect(result!.payload).toMatchObject(payload);
    });
    it('should return null for invalid', () => {
      const token = '__invalid__';
      const result = jwt.decodeJwt(token);

      expect(result).toBeNull();
    });
  });
});
