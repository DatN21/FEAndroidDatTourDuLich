import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { enviroment } from '../enviroments/enviroments';
import { BookingDTO } from '../dtos/user/booking/booking.dto';
import {AuthService} from '../service/auth.service'
import {Booking} from '../model/booking'
@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = `${enviroment.apiBaseUrl}/bookings`;

  constructor(private http: HttpClient,private authService : AuthService) {}

  createBooking(booking: BookingDTO): Observable<any> {
    return this.authService.postWithAuthHeader(this.apiUrl, booking)
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
}
