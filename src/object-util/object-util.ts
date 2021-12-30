import { LoggerFactory } from '../logger';
import { ObjectKeyType, ObjectType } from './object-util.type';

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
    const constructor = obj.constructor;
    const constructorFunc = constructor as new (...arg: unknown[]) => Type;

    if (obj instanceof Date) {
      return new constructorFunc(obj.getTime());
    } else if (obj instanceof Map || obj instanceof Set || obj instanceof RegExp) {
      return new constructorFunc(obj);
    } else if (Array.isArray(obj)) {
      return new constructorFunc(...obj);
    }

    const clonedObj = new constructorFunc();
    const keys: ObjectKeyType[] = Object.getOwnPropertyNames(obj);
    keys.push(...Object.getOwnPropertySymbols(obj));
    keys.forEach((key) => {
      let value;
      if (obj[key] instanceof Object) {
        value = deepClone(obj[key]);
      } else {
        value = obj[key];
      }

      Object.defineProperty(clonedObj, key, {
        configurable: true,
        enumerable: true,
        value,
        writable: true,
      });
    });

    return clonedObj;
  }

  export function merge(obj: ObjectType, ...args: ObjectType[]): ObjectType {
    const argKeysArray: ObjectKeyType[][] = [];
    const result = deepClone<ObjectType>(obj);

    args.forEach((arg) => {
      const keys: ObjectKeyType[] = Object.getOwnPropertyNames(arg);
      keys.push(...Object.getOwnPropertySymbols(arg));
      argKeysArray.push(keys);
    });

    for (let ix = 0; ix < args.length; ix++) {
      argKeysArray[ix].forEach((key) => {
        if (result[key] instanceof Object && args[ix][key] instanceof Object) {
          result[key] = merge(result[key], args[ix][key]);
        } else {
          result[key] = args[ix][key];
        }
      });
    }

    return result;
  }

  // TODO: number, symbol 타입의 key를 포함하도록 수정
  export function omit<Type extends ObjectType>(obj: Type, omitKeys: string[]): Type | Record<string, never> {
    if (Object.keys(obj).length <= 0) {
      return {};
    }
    if (omitKeys.length <= 0) {
      return obj;
    }

    const resultObj = deepClone<Type>(obj);

    for (const key of omitKeys) {
      const nestedKeys = key.split('.');
      let tempObj = resultObj;
      for (let i = 0; i < nestedKeys.length; i++) {
        if (i === nestedKeys.length - 1) {
          delete tempObj[nestedKeys[i]];
          break;
        }
        tempObj = tempObj[nestedKeys[i]];
      }
    }
    return resultObj;
  }
}
