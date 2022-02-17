export interface PageDetail {
  readonly page: number;
  readonly offset: number;
  readonly active: boolean;
}

export interface PageInfo {
  readonly count: number;
  readonly limit: number;
  readonly offset: number;
  readonly range?: number;
  readonly firstPage?: 0 | 1;
}

export interface Pagination {
  readonly currentPage: number;
  readonly firstPage: number;
  readonly lastPage: number;
  readonly pages: PageDetail[];
}
