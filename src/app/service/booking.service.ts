import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { enviroment } from '../enviroments/enviroments';
import { BookingDTO } from '../dtos/user/booking/booking.dto';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = `${enviroment.apiBaseUrl}/bookings`;

  constructor(private http: HttpClient) {}

  createBooking(booking: BookingDTO): Observable<any> {
    return this.http.post<any>(this.apiUrl, booking);
  }
}
