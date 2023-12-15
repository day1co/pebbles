import { MiscUtil } from '../misc-util';
import { TimeRange } from './time-range';
import { TimeSection } from './time-range.interface';

describe('TimeRange Util', () => {
  describe('time-range module', () => {
    describe('check Constructor', () => {
      it('start interval 1, start+10 = end, merge to one', async () => {
        const loadSection: Array<TimeSection> = [];
        for (let i = 0; i < 10; i++) {
          const o: TimeSection = {
            start: i,
            end: i + 10,
            interval: 10,
          };
          loadSection.push(o);
        }
        const timeRange = new TimeRange(loadSection);
        expect(timeRange.value().length).toEqual(10);

        timeRange.merge(true);

        expect(timeRange.value().length).toEqual(1);
      });
    });

    describe('gathering time section', () => {
      it('start interval 1, start+10 = end, merge to one', async () => {
        const timeRange = new TimeRange();
        for (let i = 0; i < 10; i++) {
          const o: TimeSection = {
            start: i,
            end: i + 10,
            interval: 10,
          };
          timeRange.add(o);
        }
        expect(timeRange.value().length).toEqual(10);

        timeRange.merge(true);

        expect(timeRange.value().length).toEqual(1);
      });

      it('start interval 10, start+10 = end, merge to one', async () => {
        const timeRange = new TimeRange();
        for (let i = 0; i < 10; i++) {
          const o: TimeSection = {
            start: i * 10,
            end: i * 10 + 10,
            interval: 10,
          };
          timeRange.add(o);
        }
        expect(timeRange.value().length).toEqual(10);

        timeRange.merge(true);

        expect(timeRange.value().length).toEqual(1);
      });

      it('start interval 10, start+10 = end, merge to two', async () => {
        const timeRange = new TimeRange();
        for (let i = 0; i < 4; i++) {
          const o: TimeSection = {
            start: i * 10,
            end: i * 10 + 10,
            interval: 10,
          };
          timeRange.add(o);
        }
        //split!
        for (let i = 5; i < 11; i++) {
          const o: TimeSection = {
            start: i * 10,
            end: i * 10 + 10,
            interval: 10,
          };
          timeRange.add(o);
        }
        expect(timeRange.value().length).toEqual(10);

        timeRange.merge(true);

        expect(timeRange.value().length).toEqual(2);
      });

      it('not ordering, merge to one', async () => {
        const timeRange = new TimeRange();
        const testArray = [1, 3, 0, 2, 7, 8, 5, 6, 9, 4];
        for (const i of testArray) {
          const o: TimeSection = {
            start: i * 10,
            end: i * 10 + 10,
            interval: 10,
          };
          timeRange.add(o);
        }
        expect(timeRange.value().length).toEqual(10);

        timeRange.merge(true);

        expect(timeRange.value().length).toEqual(1);
      });

      it('not ordering, uncertain interval, check totalDuration', async () => {
        const timeRange = new TimeRange();
        const testArray = [1, 3, 0, 2, 7, 8, 5, 6, 9, 4];
        let totalInterval = 0;
        for (const i of testArray) {
          const r = MiscUtil.getRandomInt(1, 10);
          const o: TimeSection = {
            start: i * r,
            end: i * r + r,
            interval: r,
          };
          timeRange.add(o);
          totalInterval += r;
        }
        expect(timeRange.value().length).toEqual(10);

        timeRange.merge(true);

        expect(timeRange.totalInterval()).toEqual(totalInterval);
      });

      it('decimal merge to one', async () => {
        const timeRange = new TimeRange([], 5);
        timeRange.add({
          start: 1.1,
          end: 11.1,
          interval: 9.1,
        });
        timeRange.add({
          start: 1.2,
          end: 30.2,
          interval: 10.2,
        });
        // native JS 9.1 + 10.2 = 19.299999999999997
        expect(timeRange.totalInterval()).toEqual(19.3);
        expect(timeRange.value().length).toEqual(2);
        timeRange.merge(true);
        expect(timeRange.value().length).toEqual(1);
        expect(timeRange.value()[0].interval).toEqual(19.3);
        expect(timeRange.value()[0].end).toEqual(30.2);
      });

      it('cale decimal points in the totalPlayTime', async () => {
        const timeRange1 = new TimeRange([], 5);
        timeRange1.add({
          start: 99.9,
          end: 100.1,
          interval: 10,
        });
        // native JS 100.1 - 99.9 = 0.19999999999998863
        expect(timeRange1.totalPlayTime()).toEqual(0.2);

        const timeRange2 = new TimeRange([], 5);
        timeRange2.add({
          start: 0,
          end: 59.08332,
          interval: 59.08332,
        });
        timeRange2.add({
          start: 227.26884,
          end: 230.481,
          interval: 6.7765600000000035,
        });
        /**
         * 59.08332 = 59.08332 - 0
         * 3.21216 = 230.481 - 227.26884
         * 62.29548 = 59.08332 + 3.21216
         * native JS 62.29547999999998
         */
        expect(timeRange2.totalPlayTime()).toEqual(62.29548);

        const timeRange3 = new TimeRange([], 1);
        timeRange3.add({
          start: 0,
          end: 59.08332,
          interval: 59.08332,
        });
        timeRange3.add({
          start: 227.26884,
          end: 230.481,
          interval: 6.7765600000000035,
        });
        expect(timeRange3.totalPlayTime()).toEqual(62.3);

        const timeRange4 = new TimeRange([], 2);
        for (let i = 0; i < 10; i++) {
          const o: TimeSection = {
            start: i * 10,
            end: i * 10 + 10,
            interval: 10,
          };
          timeRange4.add(o);
        }
        timeRange4.merge();
        expect(timeRange4.totalPlayTime()).toEqual(100);

        const timeRange5 = new TimeRange([], 5);
        timeRange5.add({
          start: 0,
          end: 100,
          interval: 100,
        });
        timeRange5.add({
          start: 90,
          end: 60 * 60 * 1000000 + 0.99, // 1,000,000 hours
          interval: 60 * 60 * 1000000 + 0.99,
        });
        timeRange5.merge();
        expect(timeRange5.totalPlayTime()).toEqual(3600000000.99);
      });
    });
  });
});
