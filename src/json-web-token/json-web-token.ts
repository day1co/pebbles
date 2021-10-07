import * as jwt from 'jsonwebtoken';

export namespace JsonWebToken {
  export function createJwt(
    key: string,
    payload: string | Record<string, unknown>,
    options?: jwt.SignOptions | undefined
  ): string {
    return jwt.sign(payload, key, options);
  }

  export function verifyJwt(token: string, key: string): string | jwt.JwtPayload {
    return jwt.verify(token, key);
  }

  export function decodeJwt(token: string): jwt.Jwt | null {
    return jwt.decode(token, { complete: true });
  }
}
