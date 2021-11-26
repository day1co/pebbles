import { PageInfo, Pagination } from './misc-util.interface';

export namespace MiscUtil {
  export async function sleep(delay: number): Promise<unknown> {
    return new Promise((resolve) => setTimeout(resolve, delay));
  }

  export function getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
  }

  export function getPagination(pageInfo: PageInfo): Pagination {
    const { count, limit, offset = 0, range = 10, firstPage = 1 } = pageInfo;
    const pages = [];
    const lastPage = count && limit ? Math.ceil(count / limit) : firstPage;
    const currentPage = limit > 0 ? Math.floor(offset / limit) + firstPage : firstPage;
    const rangeFirstPage = Math.max(currentPage - range, firstPage);
    const rangeLastPage = Math.min(currentPage + range, lastPage);

    for (let page = rangeFirstPage; page <= rangeLastPage; page += 1) {
      pages.push({ page, offset: (page - firstPage) * limit, active: page === currentPage });
    }

    return { offset, firstPage, lastPage, currentPage, pages };
  }
}
