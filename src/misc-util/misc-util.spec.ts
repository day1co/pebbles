import { MiscUtil } from './misc-util';

describe('Miscellaneous Util', () => {
  describe('sleep', () => {
    it('allow 10ms error', async () => {
      console.time('sleep');
      const startTime = Date.now();
      await MiscUtil.sleep(500);
      const finishTime = Date.now();
      console.timeEnd('sleep');
      expect(finishTime - startTime).toBeLessThan(500 + 10);
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
});
