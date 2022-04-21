import { TimeSection } from './time-range.interface';
export class TimeRange {
  private section!: Array<TimeSection>;
  constructor(loadSection: Array<TimeSection> = []) {
    this.section = loadSection;
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
            prevSection.duration += v.duration;
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
  totalDuration() {
    return this.section.reduce((p, v) => {
      p = p + v.duration;
      return p;
    }, 0);
  }
}
