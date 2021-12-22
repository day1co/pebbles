import { LoggerFactory } from '../logger';

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

  // Todo: Map과 Set 등의 특정 Object type에 대한 지원 필요
  export function deepClone<Type>(obj: Type): Type {
    if (!(obj instanceof Object)) {
      throw new Error('Should be an object type');
    } else if (obj instanceof Map || obj instanceof Set) {
      throw new Error('Map or Set is not supported type yet');
    }

    return JSON.parse(JSON.stringify(obj));
  }
}
