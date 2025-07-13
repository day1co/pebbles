export function binarySearch<T>(
  arr: T[],
  target: T,
  compareFn: (target: T, item: T) => number
): T | undefined {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const mid = left + Math.floor((right - left) / 2);
    const comparison = compareFn(target, arr[mid]);

    if (comparison === 0) {
      return arr[mid];
    }

    if (comparison < 0) {
      right = mid - 1;
    } else {
      left = mid + 1;
    }
  }

  return undefined;
}
