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
    });

    // Additional edge case tests
    describe('edge cases', () => {
      it('should merge adjacent sections (where one section ends exactly where another begins)', async () => {
        const timeRange = new TimeRange();
        const section1: TimeSection = { start: 0, end: 10, interval: 10 };
        const section2: TimeSection = { start: 10, end: 20, interval: 10 }; // Starts exactly where section1 ends
        
        timeRange.add(section1);
        timeRange.add(section2);
        timeRange.merge(true);
        
        // Should be merged into one section
        expect(timeRange.value().length).toEqual(1);
        expect(timeRange.value()[0]).toEqual({ start: 0, end: 20, interval: 20 });
      });

      it('should handle zero-duration sections correctly', async () => {
        const timeRange = new TimeRange();
        const section1: TimeSection = { start: 5, end: 5, interval: 0 }; // Zero duration
        const section2: TimeSection = { start: 5, end: 10, interval: 5 }; // Overlaps with zero-duration section
        
        timeRange.add(section1);
        timeRange.add(section2);
        timeRange.merge(true);
        
        // The merged section should have the proper bounds and interval
        expect(timeRange.value().length).toEqual(1);
        expect(timeRange.value()[0]).toEqual({ start: 5, end: 10, interval: 5 });
      });

      it('should handle negative time values correctly', async () => {
        const timeRange = new TimeRange();
        const section1: TimeSection = { start: -10, end: -5, interval: 5 };
        const section2: TimeSection = { start: -7, end: -2, interval: 5 };
        
        timeRange.add(section1);
        timeRange.add(section2);
        timeRange.merge(true);
        
        // Should merge these overlapping negative sections
        expect(timeRange.value().length).toEqual(1);
        expect(timeRange.value()[0]).toEqual({ start: -10, end: -2, interval: 10 });
      });

      it('should handle non-integer time values correctly', async () => {
        const timeRange = new TimeRange();
        const section1: TimeSection = { start: 1.5, end: 3.5, interval: 2 };
        const section2: TimeSection = { start: 3, end: 5.5, interval: 2.5 };
        
        timeRange.add(section1);
        timeRange.add(section2);
        timeRange.merge(true);
        
        // Should merge these with precise floating-point bounds
        expect(timeRange.value().length).toEqual(1);
        expect(timeRange.value()[0]).toEqual({ start: 1.5, end: 5.5, interval: 4.5 });
      });

      it('should handle multiple sections with the same start time', async () => {
        const timeRange = new TimeRange();
        const section1: TimeSection = { start: 10, end: 20, interval: 10 };
        const section2: TimeSection = { start: 10, end: 15, interval: 5 }; // Same start, earlier end
        const section3: TimeSection = { start: 10, end: 25, interval: 15 }; // Same start, later end
        
        timeRange.add(section1);
        timeRange.add(section2);
        timeRange.add(section3);
        timeRange.merge(true);
        
        // Should merge all three into one section with the maximum end time
        expect(timeRange.value().length).toEqual(1);
        expect(timeRange.value()[0]).toEqual({ start: 10, end: 25, interval: 30 });
      });

      it('should handle negative interval values correctly', async () => {
        const timeRange = new TimeRange();
        const section1: TimeSection = { start: 0, end: 10, interval: -5 }; // Negative interval
        const section2: TimeSection = { start: 5, end: 15, interval: 10 };
        
        timeRange.add(section1);
        timeRange.add(section2);
        timeRange.merge(true);
        
        // The merged result should add the intervals, even if negative
        expect(timeRange.value().length).toEqual(1);
        expect(timeRange.value()[0]).toEqual({ start: 0, end: 15, interval: 5 }); // -5 + 10 = 5
      });

      it('should correctly merge complex overlapping sections', async () => {
        const timeRange = new TimeRange();
        // Create a complex overlapping pattern:
        // A:     |-------|
        // B:        |-------|
        // C:           |-------|
        // D:  |---|
        // E:                       |---|
        const sectionA: TimeSection = { start: 10, end: 30, interval: 20 };
        const sectionB: TimeSection = { start: 20, end: 40, interval: 20 };
        const sectionC: TimeSection = { start: 30, end: 50, interval: 20 };
        const sectionD: TimeSection = { start: 5, end: 15, interval: 10 };
        const sectionE: TimeSection = { start: 60, end: 70, interval: 10 };
        
        timeRange.add(sectionA);
        timeRange.add(sectionB);
        timeRange.add(sectionC);
        timeRange.add(sectionD);
        timeRange.add(sectionE);
        timeRange.merge(true);
        
        // Should result in two merged sections: one from D+A+B+C and one for E
        expect(timeRange.value().length).toEqual(2);
        expect(timeRange.value()[0]).toEqual({ start: 5, end: 50, interval: 70 });
        expect(timeRange.value()[1]).toEqual({ start: 60, end: 70, interval: 10 });
      });

      it('should be sensitive to mutations of section objects after adding but before merging', async () => {
        const timeRange = new TimeRange();
        const section1: TimeSection = { start: 0, end: 10, interval: 10 };
        const section2: TimeSection = { start: 20, end: 30, interval: 10 };
        
        timeRange.add(section1);
        timeRange.add(section2);
        
        // Mutate section1 after adding but before merging
        section1.end = 25; // Now it overlaps with section2
        
        timeRange.merge(true);
        
        // The merge should reflect the mutation
        expect(timeRange.value().length).toEqual(1);
        expect(timeRange.value()[0]).toEqual({ start: 0, end: 30, interval: 20 });
      });

      it('should handle very large gaps between sections', async () => {
        const timeRange = new TimeRange();
        const section1: TimeSection = { start: 0, end: 100, interval: 100 };
        const section2: TimeSection = { start: 1000000, end: 1000100, interval: 100 };
        
        timeRange.add(section1);
        timeRange.add(section2);
        timeRange.merge(true);
        
        // These sections are far apart and should not merge
        expect(timeRange.value().length).toEqual(2);
        expect(timeRange.value()[0]).toEqual(section1);
        expect(timeRange.value()[1]).toEqual(section2);
      });

      it('should correctly merge when one section completely contains another', async () => {
        const timeRange = new TimeRange();
        
        // Outer section completely contains inner section
        const outerSection: TimeSection = { start: 0, end: 100, interval: 100 };
        const innerSection: TimeSection = { start: 25, end: 75, interval: 50 };
        
        timeRange.add(outerSection);
        timeRange.add(innerSection);
        timeRange.merge(true);
        
        // Should merge to a single section with outer boundaries and combined interval
        expect(timeRange.value().length).toEqual(1);
        expect(timeRange.value()[0]).toEqual({ start: 0, end: 100, interval: 150 });
      });
    });
  });
});
