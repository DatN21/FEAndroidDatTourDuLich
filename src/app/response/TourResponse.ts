import { TourScheduleResponse } from "./TourScheduleResponse";

export interface TourResponse {
  id: number;
  name: string;
  code: string;
  departureLocation: string;
  status: string;
  price: number;
  description: string;
  imageHeader: string;
  createdAt: string;
  updatedAt: string;
  duration: number;
  startDate: string
  schedules?: TourScheduleResponse[]; 
}

export interface TourPageData {
  content: TourResponse[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
