import { MiscUtil } from './misc-util';
import { TimeSection } from './misc-util.interface';

describe('Miscellaneous Util', () => {
  describe('sleep', () => {
    it('allow 10ms error', async () => {
      const startTime = Date.now();
      await MiscUtil.sleep(500);
      const finishTime = Date.now();
      expect(finishTime - startTime).toBeLessThan(500 + 15);
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

  describe('time-range module', () => {
    describe('check Constructor', () => {
      it('start interval 1, start+10 = end, merge to one', async () => {
        const loadSection: Array<TimeSection> = [];
        for (let i = 0; i < 10; i++) {
          const o: TimeSection = {
            start: i,
            end: i + 10,
            duration: 10,
          };
          loadSection.push(o);
        }
        const timeRange = new MiscUtil.TimeRange(loadSection);
        expect(timeRange.value().length).toEqual(10);

        timeRange.merge(true);

        expect(timeRange.value().length).toEqual(1);
      });
    });

    describe('gathering time section', () => {
      it('start interval 1, start+10 = end, merge to one', async () => {
        const timeRange = new MiscUtil.TimeRange();
        for (let i = 0; i < 10; i++) {
          const o: TimeSection = {
            start: i,
            end: i + 10,
            duration: 10,
          };
          timeRange.add(o);
        }
        expect(timeRange.value().length).toEqual(10);

        timeRange.merge(true);

        expect(timeRange.value().length).toEqual(1);
      });

      it('start interval 10, start+10 = end, merge to one', async () => {
        const timeRange = new MiscUtil.TimeRange();
        for (let i = 0; i < 10; i++) {
          const o: TimeSection = {
            start: i * 10,
            end: i * 10 + 10,
            duration: 10,
          };
          timeRange.add(o);
        }
        expect(timeRange.value().length).toEqual(10);

        timeRange.merge(true);

        expect(timeRange.value().length).toEqual(1);
      });

      it('start interval 10, start+10 = end, merge to two', async () => {
        const timeRange = new MiscUtil.TimeRange();
        for (let i = 0; i < 4; i++) {
          const o: TimeSection = {
            start: i * 10,
            end: i * 10 + 10,
            duration: 10,
          };
          timeRange.add(o);
        }
        //split!
        for (let i = 5; i < 11; i++) {
          const o: TimeSection = {
            start: i * 10,
            end: i * 10 + 10,
            duration: 10,
          };
          timeRange.add(o);
        }
        expect(timeRange.value().length).toEqual(10);

        timeRange.merge(true);

        expect(timeRange.value().length).toEqual(2);
      });

      it('not ordering, merge to one', async () => {
        const timeRange = new MiscUtil.TimeRange();
        const testArray = [1, 3, 0, 2, 7, 8, 5, 6, 9, 4];
        for (const i of testArray) {
          const o: TimeSection = {
            start: i * 10,
            end: i * 10 + 10,
            duration: 10,
          };
          timeRange.add(o);
        }
        expect(timeRange.value().length).toEqual(10);

        timeRange.merge(true);

        expect(timeRange.value().length).toEqual(1);
      });

      it('not ordering, uncertain interval, check totalDuration', async () => {
        const timeRange = new MiscUtil.TimeRange();
        const testArray = [1, 3, 0, 2, 7, 8, 5, 6, 9, 4];
        let totalDuration = 0;
        for (const i of testArray) {
          const r = MiscUtil.getRandomInt(1, 10);
          const o: TimeSection = {
            start: i * r,
            end: i * r + r,
            duration: r,
          };
          timeRange.add(o);
          totalDuration += r;
        }
        expect(timeRange.value().length).toEqual(10);

        timeRange.merge(true);

        expect(timeRange.totalDuration()).toEqual(totalDuration);
      });
    });
  });
});
