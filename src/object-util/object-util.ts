import { LoggerFactory } from '../logger';
import { ObjectType } from './object-util.type';

const logger = LoggerFactory.getLogger('pebbles:object-util');

export namespace ObjectUtil {
  export function serialize(obj: Record<string, unknown>): string | null {
    try {
      return JSON.stringify(obj);
    } catch (exception) {
      logger.warn('Error occurred while serializing - %s', exception);
      return null;
    }
  }

  export function deserialize(str: string): Record<string, unknown> | null {
    try {
      return JSON.parse(str);
    } catch (exception) {
      logger.warn('Error occurred while deserializing - %s', exception);
      return null;
    }
  }

  export function isNullish(value: unknown): boolean {
    return value === undefined || value === null;
  }

  export function isEmpty(value: unknown): boolean {
    if (value instanceof Set || value instanceof Map) {
      return !value.size;
    }

    if (typeof value === 'string' || value instanceof Object) {
      return !Object.keys(value).length;
    }

    return true;
  }

  // Todo: 누락된 type들이 있을 것
  export function deepClone<Type extends ObjectType>(obj: Type): Type {
    let clonedObj: ObjectType;
    const constructor = obj.constructor;
    const constructorFunc = constructor as new (...arg: unknown[]) => Type;

    switch (constructor) {
      case Date:
        return new constructorFunc(obj.getTime()) as ObjectType;
      case Map:
      case Set:
      case RegExp:
        return new constructorFunc(obj) as ObjectType;
      default:
        clonedObj = new constructorFunc();
    }

    for (const property in obj) {
      const val: unknown = obj[property];
      if (!(val instanceof Object)) {
        clonedObj[property] = obj[property];
      } else {
        clonedObj[property] = deepClone(obj[property]);
      }
    }

    return clonedObj;
  }

  export function merge(obj: Record<string, unknown>, ...args: Record<string, unknown>[]): Record<string, unknown> {
    const objKeys = Object.keys(obj);
    const argKeysArray: string[][] = [];
    const result: Record<string, unknown> = {};

    args.forEach((arg) => {
      argKeysArray.push(Object.keys(arg));
    });

    objKeys.forEach((key) => {
      result[key] = obj[key];
    });

    for (let ix = 0; ix < args.length; ix++) {
      argKeysArray[ix].forEach((key) => {
        result[key] = args[ix][key];
      });
    }

    return result;
  }
}
