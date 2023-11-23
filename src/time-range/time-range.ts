import { NumberUtil } from '../number-util';
import { TimeSection } from './time-range.interface';

export class TimeRange {
  private section!: Array<TimeSection>;
  readonly decimalPlaces: number;
  constructor(loadSection: Array<TimeSection> = [], decimalPlaces = 5) {
    this.section = loadSection;
    this.decimalPlaces = decimalPlaces;
  }
  add(piece: TimeSection) {
    this.section.push(piece);
  }
  merge(debug = false) {
    if (debug) console.log('merging:', this.section);
    this.section = this.section
      .sort((a: TimeSection, b: TimeSection) => {
        return a.start >= b.start ? 1 : -1;
      })
      .reduce((p: Array<TimeSection>, v: TimeSection) => {
        if (p.length <= 0) {
          p.push(v);
        } else {
          const prevSection: TimeSection = p[p.length - 1];
          if (prevSection.end >= v.start) {
            prevSection.end = v.end > prevSection.end ? v.end : prevSection.end;
            prevSection.interval = NumberUtil.decimalRoundDown(
              NumberUtil.decimalRoundUp(prevSection.interval) + NumberUtil.decimalRoundUp(v.interval)
            );
          } else {
            p.push(v);
          }
        }
        return p;
      }, []);
    if (debug) console.log('merged:', this.section);
  }
  value() {
    return this.section;
  }
  totalInterval() {
    const result = this.section.reduce((p, v) => {
      const interval = NumberUtil.decimalRoundUp(v.interval, this.decimalPlaces);
      p = p + interval;
      return p;
    }, 0);
    return NumberUtil.decimalRoundDown(result, this.decimalPlaces);
  }
  totalPlayTime() {
    const result = this.section.reduce((p, v) => {
      const end = NumberUtil.decimalRoundUp(v.end, this.decimalPlaces);
      const start = NumberUtil.decimalRoundUp(v.start, this.decimalPlaces);
      return p + (end - start);
    }, 0);
    return NumberUtil.decimalRoundDown(result, this.decimalPlaces);
  }
}
