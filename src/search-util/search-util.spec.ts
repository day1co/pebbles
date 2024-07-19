import { SearchUtil } from './search-util';

describe('SearchUtil', () => {
  describe('binarySearch', () => {
    describe('number array', () => {
      const numbers = [1, 3, 5, 7, 9, 11, 13, 15];
      const compareFn = (target: number, item: number) => target - item;

      it('should find an existing number', () => {
        const result = SearchUtil.binarySearch(numbers, 7, compareFn);
        expect(result).toBe(7);
      });

      it('should return undefined for a non-existing number', () => {
        const result = SearchUtil.binarySearch(numbers, 6, compareFn);
        expect(result).toBeUndefined();
      });

      it('should find the first element', () => {
        const result = SearchUtil.binarySearch(numbers, 1, compareFn);
        expect(result).toBe(1);
      });

      it('should find the last element', () => {
        const result = SearchUtil.binarySearch(numbers, 15, compareFn);
        expect(result).toBe(15);
      });
    });

    describe('string array', () => {
      const fruits = ['apple', 'banana', 'cherry', 'date', 'elderberry'];
      const compareFn = (target: string, item: string) => target.localeCompare(item);

      it('should find an existing fruit', () => {
        const result = SearchUtil.binarySearch(fruits, 'cherry', compareFn);
        expect(result).toBe('cherry');
      });

      it('should return undefined for a non-existing fruit', () => {
        const result = SearchUtil.binarySearch(fruits, 'grape', compareFn);
        expect(result).toBeUndefined();
      });
    });

    describe('object array', () => {
      type Course = { id: number; name: string };

      const people: Course[] = [
        { id: 1, name: 'Course1' },
        { id: 2, name: 'Course2' },
        { id: 3, name: 'Course3' },
        { id: 4, name: 'Course4' },
      ];

      it('should find an existing person by id', () => {
        const result = SearchUtil.binarySearch(people, { id: 3, name: '' }, (target, item) => target.id - item.id);
        expect(result).toEqual({ id: 3, name: 'Course3' });
      });

      it('should return undefined for a non-existing person', () => {
        const result = SearchUtil.binarySearch(people, { id: 5, name: '' }, (target, item) => target.id - item.id);
        expect(result).toBeUndefined();
      });
    });

    describe('edge cases', () => {
      it('should handle an empty array', () => {
        const result = SearchUtil.binarySearch([], 1, (target, item) => target - item);
        expect(result).toBeUndefined();
      });

      it('should handle an array with one element (found)', () => {
        const result = SearchUtil.binarySearch([1], 1, (target, item) => target - item);
        expect(result).toBe(1);
      });

      it('should handle an array with one element (not found)', () => {
        const result = SearchUtil.binarySearch([1], 2, (target, item) => target - item);
        expect(result).toBeUndefined();
      });
    });
  });
});
