export interface PageDetail {
  page: number;
  offset: number;
  active: boolean;
}

export interface PageInfo {
  count: number;
  limit: number;
  offset: number;
  range?: number;
  firstPage?: 0 | 1;
}

export interface Pagination {
  currentPage: number;
  firstPage: number;
  lastPage: number;
  pages: PageDetail[];
}
