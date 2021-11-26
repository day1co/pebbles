export interface PageInfo {
  count: number;
  limit: number;
  offset: number;
  range?: number;
  firstPage?: number;
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
