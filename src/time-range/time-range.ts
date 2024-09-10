import { NumberUtil } from '../number-util';
import { TimeSection } from './time-range.interface';

/**
 * @params loadSection: TimeSection 배열
 * @params decimalPlaces: TimeSection 계산시 소수점 자리수를 설정하여 반올림 처리 (default 0)
 */
export class TimeRange {
  private section!: Array<TimeSection>;
  decimalPlaces: number;
  bufferSec: number;

  constructor(loadSection: Array<TimeSection> = [], decimalPlaces = 0, bufferSec = 0) {
    this.section = loadSection;
    this.decimalPlaces = decimalPlaces;
    this.bufferSec = bufferSec;

    if (this.bufferSec > 0) {
      for (let i = 0; i < this.section.length; i++) {
        const bufferStart = Math.min(this.section[i].start - this.bufferSec, 0);
        this.section[i].start = Math.max(0, this.section[i].start - this.bufferSec);
        this.section[i].end = this.section[i].end + this.bufferSec;
        this.section[i].interval = bufferStart + this.section[i].interval + this.bufferSec * 2;
      }
    }
  }

  add(piece: TimeSection) {
    if (this.bufferSec > 0) {
      const bufferStart = Math.min(piece.start - this.bufferSec, 0);
      this.section.push({
        start: Math.max(0, piece.start - this.bufferSec),
        end: piece.end + this.bufferSec,
        interval: bufferStart + piece.interval + this.bufferSec * 2,
      });
    } else {
      this.section.push(piece);
    }
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

    // 시청 구간이 없는 경우 클립 전체를 미시청 구간으로 간주
    if (timeRange.length === 0) {
      return [
        {
          start: 0,
          end: endTime,
        },
      ];
    }

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
    const start = NumberUtil.decimalRoundUp(timeRange[timeRange.length - 1].end, this.decimalPlaces);
    const end = NumberUtil.decimalRoundUp(endTime, this.decimalPlaces);
    if (start < end) {
      unwatchedTimeRange.push({
        start: timeRange[timeRange.length - 1].end,
        end: endTime,
      });
    }

    return unwatchedTimeRange;
  }
}
