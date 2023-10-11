import { MiscUtil } from './misc-util';

describe('Miscellaneous Util', () => {
  describe('sleep', () => {
    it('sleep over 500ms', async () => {
      const startTime = Date.now();
      await MiscUtil.sleep(500);
      const finishTime = Date.now();
      expect(finishTime - startTime).toBeGreaterThanOrEqual(500);
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
  });

  describe('getPagination', () => {
    it('should work', () => {
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
    it('should throw', () => {
      expect(() => MiscUtil.getPagination({ offset: 0, limit: 0, count: 10 })).toThrow();
    });
  });

  describe('setNextPagination', () => {
    test('정상실행(isNext: true)', () => {
      const result = MiscUtil.setNextPagination({ page: 2, limit: 30 });
      expect(result).toStrictEqual({ limit: 31, offset: 30 });
    });

    test('정상실행(isNext: false)', () => {
      const result = MiscUtil.setNextPagination({ page: 2, limit: 30, isNext: false });
      expect(result).toStrictEqual({ limit: 30, offset: 30 });
    });

    test('페이지가 정수가 아닌 경우 Exception', () => {
      expect(() => {
        MiscUtil.setNextPagination({ page: 0.2, limit: 30 });
      }).toThrow(Error);
    });

    test('페이지가 0보다 같거나 작은 경우 Exception', () => {
      expect(() => {
        MiscUtil.setNextPagination({ page: 0, limit: 30 });
      }).toThrow(Error);
    });

    test('페이지당 갯수가 0보다 같거나 작은 경우 Exception', () => {
      expect(() => {
        MiscUtil.setNextPagination({ page: 1, limit: 0 });
      }).toThrow(Error);
    });

    test('limit가 maxLimit를 넘어서는 경우 Exception', () => {
      expect(() => {
        MiscUtil.setNextPagination({ page: 1, limit: 1000 });
      }).toThrow(Error);
    });
  });
});
