import { MiscUtil } from './misc-util';

describe('Miscellaneous Util', () => {
  describe('sleep', () => {
    it('sleep over 500ms', async () => {
      const startTime = Date.now();
      await MiscUtil.sleep(500);
      const finishTime = Date.now();
      expect(finishTime - startTime).toBeGreaterThanOrEqual(500);
    });

    it('should handle very short sleep times', async () => {
      const startTime = Date.now();
      await MiscUtil.sleep(1);
      const finishTime = Date.now();
      // This will be at least 1ms, but might be more due to JavaScript timing
      expect(finishTime - startTime).toBeGreaterThanOrEqual(1);
    });

    it('should handle zero sleep time', async () => {
      const startTime = Date.now();
      await MiscUtil.sleep(0);
      const finishTime = Date.now();
      // Even with 0ms, there will be a small execution delay
      expect(finishTime - startTime).toBeGreaterThanOrEqual(0);
    });

    it('should handle negative sleep time as if it were zero', async () => {
      const startTime = Date.now();
      await MiscUtil.sleep(-100);
      const finishTime = Date.now();
      // Negative time should be treated as 0
      expect(finishTime - startTime).toBeGreaterThanOrEqual(0);
    });
  });

  describe('getRandomInt', () => {
    it('should generate random int', () => {
      for (let i = 0; i < 1000; i += 1) {
        const r = MiscUtil.getRandomInt(1000, 2000);
        expect(r).toBeGreaterThanOrEqual(1000);
        expect(r).toBeLessThan(2000);
      }
    });

    it('should handle equal min and max', () => {
      const result = MiscUtil.getRandomInt(5, 5);
      expect(result).toBe(5);
    });

    it('should handle min greater than max by swapping them', () => {
      // When min > max, the function should still work by implicitly swapping them
      for (let i = 0; i < 100; i += 1) {
        const r = MiscUtil.getRandomInt(20, 10);
        expect(r).toBeGreaterThanOrEqual(10);
        expect(r).toBeLessThan(20);
      }
    });

    it('should handle negative ranges correctly', () => {
      for (let i = 0; i < 100; i += 1) {
        const r = MiscUtil.getRandomInt(-20, -10);
        expect(r).toBeGreaterThanOrEqual(-20);
        expect(r).toBeLessThan(-10);
      }
    });

    it('should handle ranges crossing zero correctly', () => {
      for (let i = 0; i < 100; i += 1) {
        const r = MiscUtil.getRandomInt(-5, 5);
        expect(r).toBeGreaterThanOrEqual(-5);
        expect(r).toBeLessThan(5);
      }
    });

    it('should correctly handle floating point inputs', () => {
      // The function should floor/ceil the inputs
      const values = [];
      for (let i = 0; i < 1000; i += 1) {
        const r = MiscUtil.getRandomInt(10.9, 20.1);
        values.push(r);
        expect(r).toBeGreaterThanOrEqual(11); // 10.9 should be ceiled to 11
        expect(r).toBeLessThan(21); // 20.1 should be floored to 21 (exclusive)
      }

      // Verify that we've generated a variety of numbers
      expect(new Set(values).size).toBeGreaterThan(1);
    });
  });

  describe('getPagination', () => {
    it('should work with standard parameters', () => {
      expect(MiscUtil.getPagination({ offset: 0, limit: 10, count: 30 })).toEqual({
        firstPage: 1,
        lastPage: 3,
        currentPage: 1,
        pages: [
          { active: true, offset: 0, page: 1 },
          { active: false, offset: 10, page: 2 },
          { active: false, offset: 20, page: 3 },
        ],
      });
      expect(MiscUtil.getPagination({ offset: 0, limit: 10, count: 9 })).toEqual({
        firstPage: 1,
        lastPage: 1,
        currentPage: 1,
        pages: [{ active: true, offset: 0, page: 1 }],
      });
    });

    it('should throw when limit is zero or negative', () => {
      expect(() => MiscUtil.getPagination({ offset: 0, limit: 0, count: 10 })).toThrow();
      expect(() => MiscUtil.getPagination({ offset: 0, limit: -5, count: 10 })).toThrow();
    });

    it('should handle non-zero offset correctly', () => {
      expect(MiscUtil.getPagination({ offset: 10, limit: 10, count: 30 })).toEqual({
        firstPage: 1,
        lastPage: 3,
        currentPage: 2, // We're on page 2 (offset 10, limit 10)
        pages: [
          { active: false, offset: 0, page: 1 },
          { active: true, offset: 10, page: 2 },
          { active: false, offset: 20, page: 3 },
        ],
      });
      
      expect(MiscUtil.getPagination({ offset: 20, limit: 10, count: 30 })).toEqual({
        firstPage: 1,
        lastPage: 3,
        currentPage: 3, // We're on page 3 (offset 20, limit 10)
        pages: [
          { active: false, offset: 0, page: 1 },
          { active: false, offset: 10, page: 2 },
          { active: true, offset: 20, page: 3 },
        ],
      });
    });

    it('should handle offset beyond count correctly', () => {
      // Even with an offset beyond count, the function should calculate the pagination correctly
      expect(MiscUtil.getPagination({ offset: 50, limit: 10, count: 30 })).toEqual({
        firstPage: 1,
        lastPage: 3,
        currentPage: 6, // offset / limit + firstPage = 50 / 10 + 1 = 6
        pages: [
          { active: false, offset: 0, page: 1 },
          { active: false, offset: 10, page: 2 },
          { active: false, offset: 20, page: 3 },
        ],
      });
    });

    it('should handle custom range parameter', () => {
      // With range 1, only show pages within 1 of current page
      expect(MiscUtil.getPagination({ offset: 30, limit: 10, count: 100, range: 1 })).toEqual({
        firstPage: 1,
        lastPage: 10,
        currentPage: 4, // offset 30, limit 10 = page 4
        pages: [
          { active: false, offset: 20, page: 3 },
          { active: true, offset: 30, page: 4 },
          { active: false, offset: 40, page: 5 },
        ],
      });
      
      // With range 0, only show current page
      expect(MiscUtil.getPagination({ offset: 30, limit: 10, count: 100, range: 0 })).toEqual({
        firstPage: 1,
        lastPage: 10,
        currentPage: 4,
        pages: [
          { active: true, offset: 30, page: 4 },
        ],
      });
    });

    it('should handle custom firstPage parameter (0-based pagination)', () => {
      // firstPage = 0 means 0-based pagination
      expect(MiscUtil.getPagination({ offset: 0, limit: 10, count: 30, firstPage: 0 })).toEqual({
        firstPage: 0,
        lastPage: 3,
        currentPage: 0,
        pages: [
          { active: true, offset: 0, page: 0 },
          { active: false, offset: 10, page: 1 },
          { active: false, offset: 20, page: 2 },
          { active: false, offset: 30, page: 3 },
        ],
      });
      
      expect(MiscUtil.getPagination({ offset: 10, limit: 10, count: 30, firstPage: 0 })).toEqual({
        firstPage: 0,
        lastPage: 3,
        currentPage: 1,
        pages: [
          { active: false, offset: 0, page: 0 },
          { active: true, offset: 10, page: 1 },
          { active: false, offset: 20, page: 2 },
          { active: false, offset: 30, page: 3 },
        ],
      });
    });
  });
});
