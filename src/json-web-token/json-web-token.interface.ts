import type { Algorithm } from './json-web-token.type';

export interface IOptions {
  algorithm?: Algorithm;
  header?: IHeader;
}

export interface IHeader {
  alg: string | Algorithm;
  typ?: string;
}

export interface IJwt {
  readonly header: IHeader;
  readonly payload: string | Record<string, unknown>;
  readonly signature: string;
}
