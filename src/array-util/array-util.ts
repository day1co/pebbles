export function innerJoin<T, U>(arr1: T[], arr2: U[], key1: keyof T, key2: keyof U): Array<T & U>;
export function innerJoin<T, U, K>(
  arr1: T[],
  arr2: U[],
  callback1: (item: T) => K,
  callback2: (item: U) => K
): Array<T & U>;
export function innerJoin<T, U, K>(
  arr1: T[],
  arr2: U[],
  arg1: keyof T | ((item: T) => K),
  arg2: keyof U | ((item: U) => K)
): Array<T & U> {
  const callback1 = typeof arg1 === 'function' ? arg1 : (item: T): K => item[arg1] as K;
  const callback2 = typeof arg2 === 'function' ? arg2 : (item: U): K => item[arg2] as K;

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

export function leftJoin<T, U>(arr1: T[], arr2: U[], key1: keyof T, key2: keyof U): Array<T & Partial<U>>;
export function leftJoin<T, U, K>(
  arr1: T[],
  arr2: U[],
  callback1: (item: T) => K,
  callback2: (item: U) => K
): Array<T & Partial<U>>;
export function leftJoin<T, U, K>(
  arr1: T[],
  arr2: U[],
  arg1: keyof T | ((item: T) => K),
  arg2: keyof U | ((item: U) => K)
): Array<T & Partial<U>> {
  const callback1 = typeof arg1 === 'function' ? arg1 : (item: T): K => item[arg1] as K;
  const callback2 = typeof arg2 === 'function' ? arg2 : (item: U): K => item[arg2] as K;

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
