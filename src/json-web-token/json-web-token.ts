import jwt from 'jsonwebtoken';
import type { Jwt, Options } from './json-web-token.interface';

export namespace JsonWebToken {
  export function createJwt(key: string, payload: string | Record<string, unknown>, options?: Options): string {
    return jwt.sign(payload, key, options);
  }

  export function verifyJwt(token: string, key: string): string | Record<string, unknown> {
    return jwt.verify(token, key);
  }

  export function decodeJwt(token: string): Jwt | null {
    return jwt.decode(token, { complete: true });
  }
}
