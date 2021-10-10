import { Algorithm } from './json-web-token.type';

export interface IOptions {
  algorithm?: Algorithm | undefined;
  keyid?: string | undefined;
  expiresIn?: string | number | undefined;
  notBefore?: string | number | undefined;
  audience?: string | string[] | undefined;
  subject?: string | undefined;
  issuer?: string | undefined;
  jwtid?: string | undefined;
  mutatePayload?: boolean | undefined;
  noTimestamp?: boolean | undefined;
  header?: IHeader | undefined;
  encoding?: string | undefined;
}

export interface IHeader {
  alg: string | Algorithm;
  typ?: string | undefined;
  cty?: string | undefined;
  crit?: Array<string | Exclude<keyof IHeader, 'crit'>> | undefined;
  kid?: string | undefined;
  jku?: string | undefined;
  x5u?: string | string[] | undefined;
  'x5t#S256'?: string | undefined;
  x5t?: string | undefined;
  x5c?: string | string[] | undefined;
}

export interface IPayload {
  [key: string]: unknown;
  iss?: string | undefined;
  sub?: string | undefined;
  aud?: string | string[] | undefined;
  exp?: number | undefined;
  nbf?: number | undefined;
  iat?: number | undefined;
  jti?: string | undefined;
}

export interface IJwt {
  readonly header: IHeader;
  readonly payload: IPayload;
  readonly signature: string;
}
