import { ObjectType } from '../object-util';

export interface Tag {
  readonly text: string;
}

export interface TemplateOpts {
  readonly template: string;
  readonly view: ObjectType;
  readonly partial?: Record<string, string>;
  readonly customTag?: string[];
}
