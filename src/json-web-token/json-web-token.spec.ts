import { JsonWebToken as jwt } from './json-web-token';

describe('JsonWebToken', () => {
  it('generate token', () => {
    const key = 'key';
    const options = { header: { alg: 'HS256', typ: 'JWT' } };
    const payload = {
      t1: 't1',
      t2: 't2',
    };
    const token = jwt.encodeJwtString(key, payload, options);
    const len = token.split('.').length;

    expect(typeof token).toBe('string');
    expect(len).toBe(3);
  });
  it('verify token', () => {
    const key = 'key';
    const payload = {
      t1: 't1',
      t2: 't2',
    };
    const token = jwt.encodeJwtString(key, payload);
    const result = jwt.verifyJwtString(token, key);

    expect(result).toMatchObject(payload);
  });
  it('verify invalid token', () => {
    try {
      const key = 'key';
      const wrong_key = 'wrong_key';
      const payload = {
        t1: 't1',
        t2: 't2',
      };
      const token = jwt.encodeJwtString(key, payload);
      jwt.verifyJwtString(token, wrong_key);
    } catch (exception) {
      //ts v4.4 부터 exception object가 unknown type으로 정의
      if (exception instanceof Error) {
        expect(exception.message).toBe('invalid signature');
      }
    }
  });
  it('decoded token', () => {
    const key = 'key';
    const header = { alg: 'HS256', typ: 'JWT' };
    const payload = {
      t1: 't1',
      t2: 't2',
    };
    const token = jwt.encodeJwtString(key, payload);
    const result = jwt.decodedJwtString(token);

    expect(result!.header).toMatchObject(header);
    expect(result!.payload).toMatchObject(payload);
  });
});
