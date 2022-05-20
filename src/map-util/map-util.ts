export namespace MapUtil {
  /**
   * map 에서 key 에 해당하는 값을 반환한다. 값이 undefined 이면 defaultValue 를 반환한다.
   *
   * @param map
   * @param key
   * @param defaultValue
   */
  export function get<K, V>(map: Map<K, V>, key: K, defaultValue?: V) {
    const value = map.get(key);
    return value === undefined ? defaultValue : value;
  }
}
