import jwt from 'jsonwebtoken';
import type { IJwt, IOptions } from './json-web-token.interface';

export namespace JsonWebToken {
  export function createJwt(key: string, payload: string | Record<string, unknown>, options?: IOptions): string {
    return jwt.sign(payload, key, options);
  }

  export function verifyJwt(token: string, key: string): string | Record<string, unknown> {
    return jwt.verify(token, key);
  }

  export function decodeJwt(token: string): IJwt | null {
    return jwt.decode(token, { complete: true });
  }
}
