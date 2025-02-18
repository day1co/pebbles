import type { NarrowableType } from './type-util.type';

export function makeLiteralTypeList<T extends NarrowableType[]>(...args: T): Readonly<T> {
  return args;
}
