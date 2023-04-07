import { ArrayUtil } from './array-util';

describe('ArrayUtil', function () {
  describe('innerJoin', function () {
    it('arr1 의 원소가 탈락하는 경우', function () {
      const arr1: { a: string; b: string }[] = [
        { a: '1', b: '1' },
        { a: '2', b: '2' },
        { a: '3', b: '3' },
      ];
      const arr2: { c: string; d: string }[] = [
        { c: '1', d: '1' },
        { c: '2', d: '2' },
      ];
      const callback1 = function (item: typeof arr1[0]) {
        return item.a;
      };
      const callback2 = function (item: typeof arr2[0]) {
        return item.c;
      };
      const result = ArrayUtil.innerJoin(arr1, arr2, callback1, callback2);
      expect(result).toEqual([
        { a: '1', b: '1', c: '1', d: '1' },
        { a: '2', b: '2', c: '2', d: '2' },
      ]);
    });
    it('arr2 의 원소가 탈락하는 경우', function () {
      const arr1: { a: string; b: string }[] = [
        { a: '2', b: '2' },
        { a: '3', b: '3' },
      ];
      const arr2: { c: string; d: string }[] = [
        { c: '1', d: '1' },
        { c: '2', d: '2' },
        { c: '3', d: '3' },
      ];
      const callback1 = function (item: typeof arr1[0]) {
        return item.a;
      };
      const callback2 = function (item: typeof arr2[0]) {
        return item.c;
      };
      const result = ArrayUtil.innerJoin(arr1, arr2, callback1, callback2);
      expect(result).toEqual([
        { a: '2', b: '2', c: '2', d: '2' },
        { a: '3', b: '3', c: '3', d: '3' },
      ]);
    });
  });

  describe('leftJoin', () => {
    it('arr1 의 원소가 더 많은 경우', function () {
      const arr1: { a: string; b: string }[] = [
        { a: '1', b: '1' },
        { a: '2', b: '2' },
        { a: '3', b: '3' },
      ];
      const arr2: { c: string; d: string }[] = [
        { c: '1', d: '1' },
        { c: '2', d: '2' },
      ];
      const callback1 = function (item: typeof arr1[0]) {
        return item.a;
      };
      const callback2 = function (item: typeof arr2[0]) {
        return item.c;
      };

      const result = ArrayUtil.leftJoin(arr1, arr2, callback1, callback2);
      expect(result).toEqual([
        { a: '1', b: '1', c: '1', d: '1' },
        { a: '2', b: '2', c: '2', d: '2' },
        { a: '3', b: '3', c: undefined, d: undefined },
      ]);
    });
    it('arr2 의 원소가 더 많은 경우', function () {
      const arr1: { a: string; b: string }[] = [
        { a: '1', b: '1' },
        { a: '2', b: '2' },
      ];
      const arr2: { c: string; d: string }[] = [
        { c: '1', d: '1' },
        { c: '2', d: '2' },
        { c: '3', d: '3' },
      ];
      const callback1 = function (item: typeof arr1[0]) {
        return item.a;
      };
      const callback2 = function (item: typeof arr2[0]) {
        return item.c;
      };

      const result = ArrayUtil.leftJoin(arr1, arr2, callback1, callback2);
      expect(result).toEqual([
        { a: '1', b: '1', c: '1', d: '1' },
        { a: '2', b: '2', c: '2', d: '2' },
      ]);
    });
  });
});
