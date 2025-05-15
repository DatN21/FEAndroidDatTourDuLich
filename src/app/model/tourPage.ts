import { Tour } from '../response/TourResponse';
import { Pageable } from '../model/pageable';
import { Sort } from '../model/pageable';
export interface TourPageData {
  content: Tour[];
  pageable: Pageable;
  last: boolean;s
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  sort: Sort;
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}
