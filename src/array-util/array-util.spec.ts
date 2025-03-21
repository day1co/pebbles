import { ArrayUtil } from './array-util';

describe('ArrayUtil', function () {
  describe('innerJoin', function () {
    describe('arr1 의 원소가 탈락하는 경우', function () {
      const arr1: { a: string; b: string }[] = [
        { a: '1', b: '1' },
        { a: '2', b: '2' },
        { a: '3', b: '3' },
      ];
      const arr2: { c: string; d: string }[] = [
        { c: '1', d: '1' },
        { c: '2', d: '2' },
      ];
      const expected = [
        { a: '1', b: '1', c: '1', d: '1' },
        { a: '2', b: '2', c: '2', d: '2' },
      ];
      it('key1, key2 를 사용하는 경우', function () {
        const result = ArrayUtil.innerJoin(arr1, arr2, 'a', 'c');
        expect(result).toEqual(expected);
      });

      it('callback1, callback2 를 사용하는 경우', function () {
        const callback1 = function (item: typeof arr1[0]) {
          return item.a;
        };
        const callback2 = function (item: typeof arr2[0]) {
          return item.c;
        };
        const result = ArrayUtil.innerJoin(arr1, arr2, callback1, callback2);
        expect(result).toEqual(expected);
      });
    });

    describe('arr2 의 원소가 탈락하는 경우', function () {
      const arr1: { a: string; b: string }[] = [
        { a: '2', b: '2' },
        { a: '3', b: '3' },
      ];
      const arr2: { c: string; d: string }[] = [
        { c: '1', d: '1' },
        { c: '2', d: '2' },
        { c: '3', d: '3' },
      ];
      const expected = [
        { a: '2', b: '2', c: '2', d: '2' },
        { a: '3', b: '3', c: '3', d: '3' },
      ];
      it('key1, key2 를 사용하는 경우', function () {
        const result = ArrayUtil.innerJoin(arr1, arr2, 'a', 'c');
        expect(result).toEqual(expected);
      });
      it('callback1, callback2 를 사용하는 경우', function () {
        const callback1 = function (item: typeof arr1[0]) {
          return item.a;
        };
        const callback2 = function (item: typeof arr2[0]) {
          return item.c;
        };
        const result = ArrayUtil.innerJoin(arr1, arr2, callback1, callback2);
        expect(result).toEqual(expected);
      });
    });

    // Add boundary value tests
    describe('boundary values', () => {
      it('should handle empty arrays', () => {
        const arr1: { a: string; b: string }[] = [];
        const arr2: { c: string; d: string }[] = [
          { c: '1', d: '1' },
          { c: '2', d: '2' },
        ];
        
        // Empty first array should result in empty result
        const result1 = ArrayUtil.innerJoin(arr1, arr2, 'a', 'c');
        expect(result1).toEqual([]);
        
        // Empty second array should result in empty result
        const arr3: { a: string; b: string }[] = [
          { a: '1', b: '1' },
          { a: '2', b: '2' },
        ];
        const arr4: { c: string; d: string }[] = [];
        
        const result2 = ArrayUtil.innerJoin(arr3, arr4, 'a', 'c');
        expect(result2).toEqual([]);
      });
      
      it('should handle arrays with single elements', () => {
        const arr1: { a: string; b: string }[] = [{ a: '1', b: '1' }];
        const arr2: { c: string; d: string }[] = [{ c: '1', d: '1' }];
        
        const expected = [{ a: '1', b: '1', c: '1', d: '1' }];
        
        const result = ArrayUtil.innerJoin(arr1, arr2, 'a', 'c');
        expect(result).toEqual(expected);
      });
      
      it('should handle very large arrays efficiently', () => {
        // Create large arrays for performance testing
        const size = 1000;
        const arr1 = Array.from({ length: size }, (_, i) => ({ 
          a: i.toString(), 
          b: `value-${i}` 
        }));
        
        const arr2 = Array.from({ length: size }, (_, i) => ({ 
          c: i.toString(), 
          d: `data-${i}` 
        }));
        
        // Test that the function can handle large arrays without crashing
        const result = ArrayUtil.innerJoin(arr1, arr2, 'a', 'c');
        expect(result.length).toBe(size);
        
        // Verify correctness for a sample of entries
        expect(result[0]).toEqual({ a: '0', b: 'value-0', c: '0', d: 'data-0' });
        expect(result[size - 1]).toEqual({ 
          a: (size - 1).toString(), 
          b: `value-${size - 1}`, 
          c: (size - 1).toString(), 
          d: `data-${size - 1}` 
        });
      });
    });
    
    // Add tests for unusual data cases
    describe('edge cases', () => {
      it('should handle non-primitive key values', () => {
        // Using objects as keys - requires callback version
        const arr1 = [
          { a: { id: '1' }, b: '1' },
          { a: { id: '2' }, b: '2' }
        ];
        
        const arr2 = [
          { c: { id: '1' }, d: '1' },
          { c: { id: '2' }, d: '2' }
        ];
        
        // Using stringified object as key
        const callback1 = (item: typeof arr1[0]) => JSON.stringify(item.a);
        const callback2 = (item: typeof arr2[0]) => JSON.stringify(item.c);
        
        const result = ArrayUtil.innerJoin(arr1, arr2, callback1, callback2);
        
        // Note that the full objects are included in the result
        expect(result.length).toBe(2);
        expect(result[0].a).toEqual({ id: '1' });
        expect(result[0].c).toEqual({ id: '1' });
      });
      
      it('should handle keys with special values', () => {
        // Arrays with keys having unusual values
        const arr1 = [
          { a: '', b: '1' },           // Empty string
          { a: 'null', b: '2' },       // String "null"
          { a: 'undefined', b: '3' },  // String "undefined"
          { a: '0', b: '4' }           // String "0"
        ];
        
        const arr2 = [
          { c: '', d: 'A' },
          { c: 'null', d: 'B' },
          { c: 'undefined', d: 'C' },
          { c: '0', d: 'D' }
        ];
        
        const result = ArrayUtil.innerJoin(arr1, arr2, 'a', 'c');
        
        expect(result.length).toBe(4);
        expect(result).toContainEqual({ a: '', b: '1', c: '', d: 'A' });
        expect(result).toContainEqual({ a: 'null', b: '2', c: 'null', d: 'B' });
        expect(result).toContainEqual({ a: 'undefined', b: '3', c: 'undefined', d: 'C' });
        expect(result).toContainEqual({ a: '0', b: '4', c: '0', d: 'D' });
      });
      
      it('should handle duplicate keys', () => {
        // Arrays with duplicate keys
        const arr1 = [
          { a: '1', b: 'first' },
          { a: '1', b: 'second' }  // Duplicate key '1'
        ];
        
        const arr2 = [
          { c: '1', d: 'one' },
          { c: '1', d: 'two' }     // Duplicate key '1'
        ];
        
        // With duplicate keys, each item in arr1 will join with the matching key in arr2
        // Map.set() overwrites previous values with the same key
        const result = ArrayUtil.innerJoin(arr1, arr2, 'a', 'c');
        
        expect(result.length).toBe(2);
        expect(result[0]).toEqual({ a: '1', b: 'first', c: '1', d: 'two' });
        expect(result[1]).toEqual({ a: '1', b: 'second', c: '1', d: 'two' });
      });
    });
    
    // Add invalid parameter tests
    describe('invalid parameters', () => {
      it('should handle non-existent keys gracefully', () => {
        const arr1 = [{ a: '1', b: '1' }];
        const arr2 = [{ c: '1', d: '1' }];
        
        // @ts-ignore - Testing runtime behavior with invalid key
        expect(() => ArrayUtil.innerJoin(arr1, arr2, 'x', 'c')).not.toThrow();
        
        // @ts-ignore - Testing runtime behavior with invalid key
        const result = ArrayUtil.innerJoin(arr1, arr2, 'x', 'c');
        expect(result).toEqual([]);
      });
      
      it('should handle invalid callbacks gracefully', () => {
        const arr1 = [{ a: '1', b: '1' }];
        const arr2 = [{ c: '1', d: '1' }];
        
        // Callback that throws an error
        const badCallback = () => {
          throw new Error('Bad callback');
        };
        
        // First callback throws
        expect(() => ArrayUtil.innerJoin(arr1, arr2, badCallback, item => item.c)).toThrow();
        
        // Second callback throws
        expect(() => ArrayUtil.innerJoin(arr1, arr2, item => item.a, badCallback)).toThrow();
      });
    });
  });

  describe('leftJoin', () => {
    describe('arr1 의 원소가 더 많은 경우', function () {
      const arr1: { a: string; b: string }[] = [
        { a: '1', b: '1' },
        { a: '2', b: '2' },
        { a: '3', b: '3' },
      ];
      const arr2: { c: string; d: string }[] = [
        { c: '1', d: '1' },
        { c: '2', d: '2' },
      ];
      const expected = [
        { a: '1', b: '1', c: '1', d: '1' },
        { a: '2', b: '2', c: '2', d: '2' },
        { a: '3', b: '3', c: undefined, d: undefined },
      ];
      it('key1, key2 를 사용하는 경우', function () {
        const result = ArrayUtil.leftJoin(arr1, arr2, 'a', 'c');
        expect(result).toEqual(expected);
      });
      it('callback1, callback2 를 사용하는 경우', function () {
        const callback1 = function (item: typeof arr1[0]) {
          return item.a;
        };
        const callback2 = function (item: typeof arr2[0]) {
          return item.c;
        };

        const result = ArrayUtil.leftJoin(arr1, arr2, callback1, callback2);
        expect(result).toEqual(expected);
      });
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

    // Add boundary value tests
    describe('boundary values', () => {
      it('should handle empty arrays', () => {
        const arr1: { a: string; b: string }[] = [];
        const arr2: { c: string; d: string }[] = [
          { c: '1', d: '1' },
          { c: '2', d: '2' },
        ];
        
        // Empty first array should result in empty result
        const result1 = ArrayUtil.leftJoin(arr1, arr2, 'a', 'c');
        expect(result1).toEqual([]);
        
        // Empty second array should result in first array items with empty properties
        const arr3: { a: string; b: string }[] = [
          { a: '1', b: '1' },
          { a: '2', b: '2' },
        ];
        const arr4: { c: string; d: string }[] = [];
        
        const expected = [
          { a: '1', b: '1' },
          { a: '2', b: '2' },
        ];
        
        const result2 = ArrayUtil.leftJoin(arr3, arr4, 'a', 'c');
        expect(result2).toEqual(expected);
      });
      
      it('should handle arrays with single elements', () => {
        const arr1: { a: string; b: string }[] = [{ a: '1', b: '1' }];
        const arr2: { c: string; d: string }[] = [{ c: '1', d: '1' }];
        
        const expected = [{ a: '1', b: '1', c: '1', d: '1' }];
        
        const result = ArrayUtil.leftJoin(arr1, arr2, 'a', 'c');
        expect(result).toEqual(expected);
      });
      
      it('should handle very large arrays efficiently', () => {
        // Create large arrays for performance testing
        const size = 1000;
        const arr1 = Array.from({ length: size }, (_, i) => ({ 
          a: i.toString(), 
          b: `value-${i}` 
        }));
        
        const arr2 = Array.from({ length: size / 2 }, (_, i) => ({ 
          c: i.toString(), 
          d: `data-${i}` 
        }));
        
        // Test that the function can handle large arrays without crashing
        const result = ArrayUtil.leftJoin(arr1, arr2, 'a', 'c');
        expect(result.length).toBe(size);
        
        // Verify correctness for a sample of entries
        expect(result[0]).toEqual({ a: '0', b: 'value-0', c: '0', d: 'data-0' });
        
        // Elements that don't have a match in arr2 should still be included
        expect(result[size - 1]).toEqual({ 
          a: (size - 1).toString(), 
          b: `value-${size - 1}`
        });
      });
    });
    
    // Add tests for unusual data cases
    describe('edge cases', () => {
      it('should handle non-primitive key values', () => {
        // Using objects as keys - requires callback version
        const arr1 = [
          { a: { id: '1' }, b: '1' },
          { a: { id: '2' }, b: '2' },
          { a: { id: '3' }, b: '3' }
        ];
        
        const arr2 = [
          { c: { id: '1' }, d: '1' },
          { c: { id: '2' }, d: '2' }
        ];
        
        // Using stringified object as key
        const callback1 = (item: typeof arr1[0]) => JSON.stringify(item.a);
        const callback2 = (item: typeof arr2[0]) => JSON.stringify(item.c);
        
        const result = ArrayUtil.leftJoin(arr1, arr2, callback1, callback2);
        
        // Note that the full objects are included in the result
        expect(result.length).toBe(3);
        expect(result[0].a).toEqual({ id: '1' });
        expect(result[0].c).toEqual({ id: '1' });
        expect(result[2].a).toEqual({ id: '3' });
        expect(result[2].c).toBeUndefined();
      });
      
      it('should handle keys with special values', () => {
        // Arrays with keys having unusual values
        const arr1 = [
          { a: '', b: '1' },           // Empty string
          { a: 'null', b: '2' },       // String "null"
          { a: 'undefined', b: '3' },  // String "undefined"
          { a: '0', b: '4' }           // String "0"
        ];
        
        const arr2 = [
          { c: '', d: 'A' },
          { c: 'null', d: 'B' }
          // Missing 'undefined' and '0'
        ];
        
        const result = ArrayUtil.leftJoin(arr1, arr2, 'a', 'c');
        
        expect(result.length).toBe(4);
        expect(result).toContainEqual({ a: '', b: '1', c: '', d: 'A' });
        expect(result).toContainEqual({ a: 'null', b: '2', c: 'null', d: 'B' });
        expect(result).toContainEqual({ a: 'undefined', b: '3' });
        expect(result).toContainEqual({ a: '0', b: '4' });
      });
      
      it('should handle duplicate keys', () => {
        // Arrays with duplicate keys
        const arr1 = [
          { a: '1', b: 'first' },
          { a: '1', b: 'second' },
          { a: '2', b: 'third' }
        ];
        
        const arr2 = [
          { c: '1', d: 'one' },
          { c: '1', d: 'two' }     // Duplicate key '1'
        ];
        
        // With duplicate keys, each item in arr1 will join with the LAST matching key in arr2
        const result = ArrayUtil.leftJoin(arr1, arr2, 'a', 'c');
        
        expect(result.length).toBe(3);
        expect(result[0]).toEqual({ a: '1', b: 'first', c: '1', d: 'two' });
        expect(result[1]).toEqual({ a: '1', b: 'second', c: '1', d: 'two' });
        expect(result[2]).toEqual({ a: '2', b: 'third' });
      });
    });
    
    // Add invalid parameter tests
    describe('invalid parameters', () => {
      it('should handle non-existent keys gracefully', () => {
        const arr1 = [{ a: '1', b: '1' }];
        const arr2 = [{ c: '1', d: '1' }];
        
        // @ts-ignore - Testing runtime behavior with invalid key
        expect(() => ArrayUtil.leftJoin(arr1, arr2, 'x', 'c')).not.toThrow();
        
        // @ts-ignore - Testing runtime behavior with invalid key
        const result = ArrayUtil.leftJoin(arr1, arr2, 'x', 'c');
        expect(result.length).toBe(1);
        expect(result[0]).toEqual({ a: '1', b: '1' });
      });
      
      it('should handle invalid callbacks gracefully', () => {
        const arr1 = [{ a: '1', b: '1' }];
        const arr2 = [{ c: '1', d: '1' }];
        
        // Callback that throws an error
        const badCallback = () => {
          throw new Error('Bad callback');
        };
        
        // First callback throws
        expect(() => ArrayUtil.leftJoin(arr1, arr2, badCallback, item => item.c)).toThrow();
        
        // Second callback throws - should not prevent function from working
        // since the error would only occur when processing arr2
        const goodCallback = (item: typeof arr1[0]) => item.a;
        expect(() => ArrayUtil.leftJoin(arr1, arr2, goodCallback, badCallback)).toThrow();
      });
    });
  });
});
