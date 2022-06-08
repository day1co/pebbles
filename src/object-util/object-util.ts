import { ObjectKeyType, ObjectType } from './object-util.type';

export namespace ObjectUtil {
  export function serialize(obj: Readonly<ObjectType>): string | null {
    try {
      return JSON.stringify(obj);
    } catch (exception) {
      return null;
    }
  }

  export function deserialize(str: string): ObjectType | null {
    try {
      return JSON.parse(str);
    } catch (exception) {
      return null;
    }
  }

  export function isNullish(value: unknown): boolean {
    return value === undefined || value === null;
  }

  export function isEmpty(value: unknown): boolean {
    if (value === null) {
      return true;
    }
    if (value instanceof Set || value instanceof Map) {
      return !value.size;
    }
    if (typeof value === 'string' || typeof value === 'object') {
      return !Object.keys(value).length;
    }

    return true;
  }

  export function deepClone<Type extends ObjectType>(obj: Type): Type {
    const constructor = obj.constructor as new (...arg: unknown[]) => Type;

    if (obj instanceof Date) {
      return new constructor(obj.getTime());
    } else if (obj instanceof Map || obj instanceof Set || Array.isArray(obj)) {
      const result = new constructor();
      const iterator = obj.entries();

      for (const item of iterator) {
        const value = typeof item[1] === 'object' ? deepClone(item[1]) : item[1];

        if (result instanceof Map) {
          result.set(item[0], value);
        } else if (result instanceof Set) {
          result.add(value);
        } else if (Array.isArray(result)) {
          result.push(value);
        }
      }

      return result;
    } else if (obj instanceof RegExp) {
      return new constructor(obj);
    } else if (obj instanceof ArrayBuffer) {
      const clonedBuf = new constructor(obj.byteLength);
      new Uint8Array(clonedBuf as unknown as ArrayBuffer).set(new Uint8Array(obj));
      return clonedBuf;
    } else if (obj instanceof Function) {
      return obj;
    }

    const clonedObj = constructor ? new constructor() : (new Object() as Type);
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

  export function merge(obj: Readonly<ObjectType>, ...args: Readonly<ObjectType[]>): ObjectType {
    const argKeysArray: ObjectKeyType[][] = [];
    const mergedObj = deepClone<ObjectType>(obj);

    args.forEach((arg) => {
      if (!(arg instanceof Function)) {
        argKeysArray.push(getAllPropertyKeys(arg));
      }
    });

    for (let ix = 0; ix < args.length; ix++) {
      argKeysArray[ix].forEach((key) => {
        if (isObjectTypeExceptFunction(mergedObj[key]) && isObjectTypeExceptFunction(args[ix][key])) {
          mergedObj[key] = merge(mergedObj[key], args[ix][key]);
        } else {
          mergedObj[key] = args[ix][key];
        }
      });
    }

    return mergedObj;
  }

  export function omit(obj: Readonly<ObjectType>, omitKeys: Readonly<ObjectKeyType[]>): ObjectType {
    function omitObject(obj: ObjectType, omitKeys: Readonly<ObjectKeyType[]>): ObjectType {
      const objKeys = getAllPropertyKeys(obj);
      omitKeys.forEach((omitKey) => {
        const nestedKeys: ObjectKeyType[] = [];

        if (typeof omitKey === 'string') {
          const index = omitKey.includes('.') ? omitKey.indexOf('.') : omitKey.length;
          nestedKeys.push(omitKey.substring(0, index));

          if (index < omitKey.length - 1) {
            nestedKeys.push(omitKey.substring(index + 1, omitKey.length));
          }
        } else if (typeof omitKey === 'number') {
          nestedKeys.push(omitKey.toString());
        } else {
          nestedKeys.push(omitKey);
        }

        if (objKeys.includes(nestedKeys[0])) {
          if (nestedKeys.length > 1) {
            obj[nestedKeys[0]] = omitObject(obj[nestedKeys[0]], [nestedKeys[1]]);
          } else {
            delete obj[nestedKeys[0]];
          }
        }
      });

      if (Array.isArray(obj)) {
        for (let ix = obj.length - 1; ix >= 0; ix--) {
          if (obj[ix] === undefined) {
            obj.splice(ix, 1);
          }
        }
      }

      return obj;
    }

    const resultObj = deepClone(obj);

    if (getAllPropertyKeys(obj).length <= 0 || omitKeys.length <= 0) {
      return resultObj;
    }

    return omitObject(resultObj, omitKeys);
  }

  export function isEqual(obj: ObjectType, other: Readonly<ObjectType>): boolean {
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

  export function getAllPropertyKeys(obj: Readonly<ObjectType>): ObjectKeyType[] {
    return [...Object.getOwnPropertyNames(obj), ...Object.getOwnPropertySymbols(obj)];
  }

  export function pick(obj: Readonly<ObjectType>, keyList: Readonly<ObjectKeyType[]>): Readonly<ObjectType> {
    const ret: ObjectType = {};
    keyList.forEach((key) => {
      if (obj[key] !== undefined) {
        ret[key] = obj[key];
      }
    });

    return ret;
  }
}

function isObjectTypeExceptFunction(arg: unknown) {
  return arg instanceof Object && !(arg instanceof Function);
}
