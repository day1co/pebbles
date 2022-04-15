import { PageInfo, Pagination, TimeSection } from './misc-util.interface';

export namespace MiscUtil {
  export async function sleep(delay: number): Promise<unknown> {
    return new Promise((resolve) => setTimeout(resolve, delay));
  }

  export function getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
  }

  export function getPagination(pageInfo: Readonly<PageInfo>): Pagination {
    const { count, limit, offset, range = 10, firstPage = 1 } = pageInfo;

    if (limit <= 0) throw new Error('limit must be bigger than 0');

    const pages = [];
    const lastPage = count && limit ? Math.ceil(count / limit) : firstPage;
    const currentPage = limit > 0 ? Math.floor(offset / limit) + firstPage : firstPage;
    const rangeFirstPage = Math.max(currentPage - range, firstPage);
    const rangeLastPage = Math.min(currentPage + range, lastPage);

    for (let page = rangeFirstPage; page <= rangeLastPage; page += 1) {
      pages.push({ page, offset: (page - firstPage) * limit, active: page === currentPage });
    }

    return { firstPage, lastPage, currentPage, pages };
  }

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
}
