export interface ImageResponse {
 id: number;
 tourId: number;
 imgUrl: string;   
}
export interface TourImageResponsePage {
  content: ImageResponse[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
}
