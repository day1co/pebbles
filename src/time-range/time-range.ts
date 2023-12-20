import { NumberUtil } from '../number-util';
import { TimeSection } from './time-range.interface';

/**
 * @params loadSection: TimeSection 배열
 * @params decimalPlaces: TimeSection 계산시 소수점 자리수를 설정하여 반올림 처리 (default 0)
 * @params correction: 모든 클립 playtime의 오차 보정 수치 (default 0.01%)
 */
export class TimeRange {
  private section!: Array<TimeSection>;
  decimalPlaces: number;
  correction: number;
  constructor(loadSection: Array<TimeSection> = [], decimalPlaces = 0, correction = 0.0001) {
    this.section = loadSection;
    this.decimalPlaces = decimalPlaces;
    this.correction = correction;
  }
  add(piece: TimeSection) {
    this.section.push(piece);
  }
  merge(debug = false) {
    // eslint-disable-next-line no-console
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
    // eslint-disable-next-line no-console
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
  increaseCorrection(allPlayTime: number) {
    return allPlayTime + Math.round(allPlayTime * this.correction);
  }
}
