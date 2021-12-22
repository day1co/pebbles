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

    if (typeof value === 'string' || value instanceof Object || value instanceof Buffer) {
      return !Object.keys(value).length;
    }

    return true;
  }

  // Todo: Buffer type에 대한 지원 필요
  export function deepClone<Type extends ObjectType>(obj: Type): Type {
    if (obj instanceof Buffer) {
      throw new Error('Buffer is not a supported type yet');
    }

    if (obj instanceof (Map || Set)) {
      const result = new Map();
      const keys = Array.from(obj.keys());

      keys.forEach((key) => {
        result.set(key, obj.get(key));
      });

      return result as ObjectType;
    }

    if (obj instanceof Set) {
      const result = new Set();
      const keys = Array.from(obj.keys());

      keys.forEach((key) => {
        result.add(key);
      });

      return result as ObjectType;
    }

    return JSON.parse(JSON.stringify(obj));
  }
}
