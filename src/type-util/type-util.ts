import type { NarrowableType } from './type-util.type';

export namespace TypeUtil {
  export function makeLiteralTypeList<T extends NarrowableType[]>(...args: T): Readonly<T> {
    return args;
  }
}
