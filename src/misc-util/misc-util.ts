import { PageInfo, Pagination, PageDetail } from './misc-util.interface';

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

    const pages: PageDetail[] = [];
    const lastPage = count && limit ? Math.ceil(count / limit) : firstPage;
    const currentPage = limit > 0 ? Math.floor(offset / limit) + firstPage : firstPage;
    const rangeFirstPage = Math.max(currentPage - range, firstPage);
    const rangeLastPage = Math.min(currentPage + range, lastPage);

    for (let page = rangeFirstPage; page <= rangeLastPage; page += 1) {
      pages.push({ page, offset: (page - firstPage) * limit, active: page === currentPage });
    }

    return { firstPage, lastPage, currentPage, pages };
  }
}
