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
});
