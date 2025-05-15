export interface Sort {
  property: string;
  direction: 'ASC' | 'DESC';
}

export interface Pageable {
  pageNumber: number;
  pageSize: number;
  sort: Sort;
  offset: number;
  paged: boolean;
  unpaged: boolean;
}
