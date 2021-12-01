export interface PageInfo {
  readonly count: number;
  readonly limit: number;
  readonly offset: number;
  readonly range?: number;
  readonly firstPage?: 0 | 1;
}

export interface Pagination {
  currentPage: number;
  firstPage: number;
  lastPage: number;
  pages: PageDetail[];
}

export interface PageDetail {
  page: number;
  offset: number;
  active: boolean;
}
