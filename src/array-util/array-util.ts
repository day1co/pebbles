export namespace ArrayUtil {
  export function innerJoin<T, U, K>(
    arr1: T[],
    arr2: U[],
    callback1: (item: T) => K,
    callback2: (item: U) => K
  ): Array<T & U> {
    const map = new Map<K, U>();
    for (const item of arr2) {
      const key = callback2(item);
      map.set(key, item);
    }

    const result: Array<T & U> = [];
    for (const item of arr1) {
      const key = callback1(item);
      const matched = map.get(key);
      if (matched) {
        result.push({ ...item, ...matched });
      }
    }

    return result;
  }

  export function leftJoin<T, U, K>(
    arr1: T[],
    arr2: U[],
    callback1: (item: T) => K,
    callback2: (item: U) => K
  ): Array<T & Partial<U>> {
    const map = new Map<K, U>();
    for (const item of arr2) {
      const key = callback2(item);
      map.set(key, item);
    }

    const result: Array<T & Partial<U>> = [];
    for (const item of arr1) {
      const key = callback1(item);
      const matched = map.get(key) ?? {};
      result.push({ ...item, ...matched });
    }

    return result;
  }
}
