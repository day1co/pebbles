import { NumberUtil } from '../number-util';
import { TimeSection } from './time-range.interface';

export class TimeRange {
  private section!: Array<TimeSection>;
  readonly decimalByKollus: number;
  constructor(loadSection: Array<TimeSection> = []) {
    this.section = loadSection;
    this.decimalByKollus = 5; // https://catenoid-support.atlassian.net/wiki/spaces/SUP/pages/3312250/V+G+Controller#progress
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
            prevSection.interval += v.interval;
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
    return this.section.reduce((p, v) => {
      p = p + v.interval;
      return p;
    }, 0);
  }
  totalPlayTime() {
    return this.section.reduce((p, v) => {
      const end = NumberUtil.decimalRoundUp(v.end, this.decimalByKollus);
      const start = NumberUtil.decimalRoundUp(v.start, this.decimalByKollus);
      const value = NumberUtil.decimalRoundUp(p, this.decimalByKollus);
      p = value + (end - start);
      return NumberUtil.decimalRoundDown(p, this.decimalByKollus);
    }, 0);
  }
}
