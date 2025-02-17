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
