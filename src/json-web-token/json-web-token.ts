import * as jwt from 'jsonwebtoken';

export namespace JsonWebToken {
  export function encodeJwtString(
    key: string,
    payload: string | Record<string, unknown>,
    options?: jwt.SignOptions | undefined
  ): string {
    return jwt.sign(payload, key, options);
  }

  export function verifyJwtString(token: string, key: string): string | jwt.JwtPayload {
    return jwt.verify(token, key);
  }

  export function decodedJwtString(token: string): jwt.Jwt | null {
    return jwt.decode(token, { complete: true });
  }
}
