import { ObjectType } from '../object-util';

export interface Tag {
  text: string;
}

export interface TemplateOpts {
  template: string;
  view: ObjectType;
  partial?: Record<string, string>;
  customTag?: [string, string];
}

export interface MaskingOpts {
  text: string;
  length: number;
  maskingStart: number;
}
