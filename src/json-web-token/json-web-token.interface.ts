import type { Algorithm } from './json-web-token.type';

export interface Options {
  algorithm?: Algorithm;
  header?: Header;
}

export interface Header {
  alg: string | Algorithm;
  typ?: string;
}

export interface Jwt {
  readonly header: Header;
  readonly payload: string | Record<string, unknown>;
  readonly signature: string;
}
