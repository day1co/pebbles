import { NumberUtil } from '../number-util';
import { TimeSection } from './time-range.interface';

/**
 * @params loadSection: TimeSection 배열
 * @params decimalPlaces: TimeSection 계산시 소수점 자리수를 설정하여 반올림 처리 (default 0)
 */
export class TimeRange {
  private section!: Array<TimeSection>;
  decimalPlaces: number;

  constructor(loadSection: Array<TimeSection> = [], decimalPlaces = 0) {
    this.section = loadSection;
    this.decimalPlaces = decimalPlaces;
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
              NumberUtil.decimalRoundUp(prevSection.interval, this.decimalPlaces) +
                NumberUtil.decimalRoundUp(v.interval, this.decimalPlaces),
              this.decimalPlaces
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

  getUnwatchedTimeRange(endTime: number) {
    const unwatchedTimeRange: Omit<TimeSection, 'interval'>[] = [];
    // 정렬된 시청 구간을 기준으로 미시청 구간을 계산
    const timeRange = this.section.sort((a, b) => a.start - b.start);

    // 클립의 시작부터 첫 시청 구간의 시작까지의 미시청 구간 추가
    if (timeRange[0].start > 0) {
      unwatchedTimeRange.push({
        start: 0,
        end: timeRange[0].start,
      });
    }

    // 시청 구간들 사이의 미시청 구간 계산
    for (let i = 0; i < timeRange.length - 1; i++) {
      if (timeRange[i].end < timeRange[i + 1].start) {
        unwatchedTimeRange.push({
          start: timeRange[i].end,
          end: timeRange[i + 1].start,
        });
      }
    }

    // 마지막 시청 구간의 끝부터 클립의 끝까지의 미시청 구간 추가
    if (timeRange[timeRange.length - 1].end < endTime) {
      unwatchedTimeRange.push({
        start: timeRange[timeRange.length - 1].end,
        end: endTime,
      });
    }

    return unwatchedTimeRange;
  }
}
