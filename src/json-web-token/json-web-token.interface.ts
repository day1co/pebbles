import { Algorithm } from './json-web-token.type';

export interface IOptions {
  algorithm?: Algorithm;
  header?: IHeader;
}

export interface IHeader {
  alg: string | Algorithm;
  typ?: string;
}

export interface IPayload {
  [key: string]: unknown;
}

export interface IJwt {
  readonly header: IHeader;
  readonly payload: IPayload;
  readonly signature: string;
}
