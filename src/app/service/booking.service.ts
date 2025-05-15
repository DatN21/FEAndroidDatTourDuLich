import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { enviroment } from '../enviroments/enviroments';
import { BookingDTO } from '../dtos/user/booking/booking.dto';
import {AuthService} from '../service/auth.service'
import {Booking} from '../model/booking'
import {ApiResponse} from '../response/APIResponse'
import {BookingDetailResponseByBookingId} from '../response/BookingDetailResponseByBookingId'
import { url } from 'node:inspector';
import { BookingDetailDTO, BookingDetailDTOInput } from '../dtos/BookingDetailDTOInput';
@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = `${enviroment.apiBaseUrl}/bookings`;

  constructor(private http: HttpClient,private authService : AuthService) {}

  createBooking(customerData: any): Observable<boolean> {
  return this.authService.postWithAuthHeader(this.apiUrl, customerData).pipe(
    map(response => response.success)  // Trả về true nếu thành công, false nếu thất bại
  );
}

  getAllBookings(page: number, limit: number): Observable<any> {
    const url = `${this.apiUrl}?page=${page}&limit=${limit}`;
    return this.authService.getWithAuthHeader(url);
  }
  
  // updateUser(id: number, userDTOUpdate: any): Observable<any> {
  //   const url = `${this.apiUrl}/${id}`;

  //   return this.authService.putWithAuthHeader(url, userDTOUpdate);
  // }

  deleteBooking(id: number): Observable<void> {
    const urlDelete =`${this.apiUrl}/${id}`
    return this.authService.deleteWithAuthHeader(urlDelete);
  }

  updateBookingStatus(id: number, status: string): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.authService.putWithAuthHeader(url,  status );
  }

  getBookingsByUser(userId: number) {
    const url =  `${this.apiUrl}/user/${userId}`;
     return this.authService.getWithAuthHeader(url);
  }

 getBookingDetailByBookingId(bookingId: number): Observable<ApiResponse<BookingDetailResponseByBookingId>> {
  const url = `${this.apiUrl}/bookingDetail/${bookingId}`;
  return this.authService.getWithAuthHeader(url) as Observable<ApiResponse<BookingDetailResponseByBookingId>>;
}

}
