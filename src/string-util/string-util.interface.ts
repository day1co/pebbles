import { ObjectType } from '../object-util';

export interface Tag {
  text: string;
}

export interface TemplateOpts {
  readonly template: string;
  readonly view: ObjectType;
  readonly partial?: Record<string, string>;
  readonly customTag?: string[];
}
