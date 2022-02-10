import { LoggerFactory } from '../logger';
import { ObjectKeyType, ObjectType } from './object-util.type';

const logger = LoggerFactory.getLogger('pebbles:object-util');

export namespace ObjectUtil {
  export function serialize(obj: ObjectType): string | null {
    try {
      return JSON.stringify(obj);
    } catch (exception) {
      logger.warn('Error occurred while serializing - %s', exception);
      return null;
    }
  }

  export function deserialize(str: string): ObjectType | null {
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

  export function deepClone<Type extends ObjectType>(obj: Type): Type {
    const constructor = obj.constructor as new (...arg: unknown[]) => Type;

    if (obj instanceof Date) {
      return new constructor(obj.getTime());
    } else if (obj instanceof Map || obj instanceof Set || obj instanceof RegExp) {
      return new constructor(obj);
    } else if (obj instanceof ArrayBuffer) {
      const clonedBuf = new constructor(obj.byteLength);
      new Uint8Array(clonedBuf as unknown as ArrayBuffer).set(new Uint8Array(obj));
      return clonedBuf;
    } else if (Array.isArray(obj)) {
      return new constructor(...obj);
    }

    const clonedObj = new constructor();
    getAllPropertyKeys(obj).forEach((key) => {
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
    const mergedObj = deepClone<ObjectType>(obj);

    args.forEach((arg) => {
      argKeysArray.push(getAllPropertyKeys(arg));
    });

    for (let ix = 0; ix < args.length; ix++) {
      argKeysArray[ix].forEach((key) => {
        if (mergedObj[key] instanceof Object && args[ix][key] instanceof Object) {
          mergedObj[key] = merge(mergedObj[key], args[ix][key]);
        } else {
          mergedObj[key] = args[ix][key];
        }
      });
    }

    return mergedObj;
  }

  // TODO: array에 대한 처리
  export function omit(obj: ObjectType, omitKeys: ObjectKeyType[]): ObjectType {
    const resultObj = deepClone(obj);

    if (getAllPropertyKeys(obj).length <= 0 || omitKeys.length <= 0) {
      return resultObj;
    }

    for (const key of omitKeys) {
      let tempObj = resultObj;
      let nestedKeys: ObjectKeyType[] = [key];

      if (typeof key === 'string') {
        nestedKeys = key.split('.');
      }
      nestedKeys.forEach((tempKey, index) => {
        if (isNullish(tempObj[tempKey])) {
          return false;
        }
        if (index === nestedKeys.length - 1) {
          delete tempObj[tempKey];
          return false;
        }
        tempObj = tempObj[tempKey];
        return true;
      });
    }
    return resultObj;
  }

  export function isEqual(obj: ObjectType, other: ObjectType): boolean {
    if (obj.constructor !== other.constructor) {
      return false;
    }
    if (obj instanceof Map || obj instanceof Set) {
      const assertedOther = other as Map<unknown, unknown> | Set<unknown>;
      if (obj.size !== other.size) {
        return false;
      }
      const objArr = Array.from(obj);
      const otherArr = Array.from(assertedOther);
      return isEqual(objArr.sort(), otherArr.sort());
    } else if (obj instanceof Date) {
      return obj.getTime() === (other as Date).getTime();
    } else if (obj instanceof RegExp) {
      return obj.toString() === (other as RegExp).toString();
    }
    const objKeys = getAllPropertyKeys(obj);
    const otherKeys = getAllPropertyKeys(other);
    if (objKeys.length !== otherKeys.length) {
      return false;
    }

    for (const key of objKeys) {
      if (obj[key] instanceof Object && other[key] instanceof Object) {
        if (!isEqual(obj[key], other[key])) return false;
      } else {
        if (obj[key] !== other[key]) return false;
      }
    }
    return true;
  }

  export function getAllPropertyKeys(obj: ObjectType): ObjectKeyType[] {
    return [...Object.getOwnPropertyNames(obj), ...Object.getOwnPropertySymbols(obj)];
  }

  export function pick(obj: ObjectType, keyList: ObjectKeyType[]): ObjectType {
    const ret: ObjectType = {};
    keyList.forEach((key) => {
      if (obj[key] !== undefined) {
        ret[key] = obj[key];
      }
    });

    return ret;
  }
}
