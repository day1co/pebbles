/**
 * map 에서 key 에 해당하는 값을 반환한다. 값이 undefined 이면 defaultValue 를 반환한다.
 *
 * @param map
 * @param key
 * @param defaultValue
 */

export function getMapValue<K, V>(map: Map<K, V>, key: K): V | undefined;
export function getMapValue<K, V>(map: Map<K, V>, key: K, defaultValue: V): V;
export function getMapValue<K, V>(map: Map<K, V>, key: K, defaultValue?: V): V | undefined {
  const value = map.get(key);
  return value === undefined ? defaultValue : value;
}

export function groupByKey<T, K extends keyof T>(array: T[], key: K): Map<T[K], T[]> {
  return groupBy(array, (item) => item[key]);
}

export function groupBy<T, K>(array: T[], callback: (item: T) => K): Map<K, T[]> {
  return array.reduce((map, item) => {
    const mapKey = callback(item);
    if (mapKey === undefined) {
      return map;
    }
    const collection = map.get(mapKey) ?? map.set(mapKey, []).get(mapKey);
    collection.push(item);
    return map;
  }, new Map());
}
