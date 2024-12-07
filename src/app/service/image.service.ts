import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { enviroment } from '../enviroments/enviroments';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams,HttpHeaders,HttpEventType,HttpEvent,HttpErrorResponse} from '@angular/common/http';
import {AuthService} from '../service/auth.service'
@Injectable({
  providedIn: 'root',
})
export class ImageService {
    private apiUrl = `${enviroment.apiBaseUrl}/images`;
    constructor(private http: HttpClient,private authService:AuthService) { }
    getImagesByTourId(tourId: number, page: number, size: number): Observable<any> {
      const url = `${this.apiUrl}/${tourId}?page=${page}&size=${size}`;
      return this.http.get<any>(url); // Gọi API trực tiếp qua HttpClient
    } 
    
    getImageWithToken(imgUrl: string): Observable<Blob> {
      const url = `${this.apiUrl}/full/${imgUrl}`;
      return this.http.get(url, { responseType: 'blob' });
    }
    

      deleteImage(imageId: number): Observable<void> {
        const urlDelete = `${this.apiUrl}/${imageId}`
        return this.authService.deleteWithAuthHeader(urlDelete);
      }

      getImagesByTourIdArray(tourId: number): Observable<any[]> {
        const url = `${this.apiUrl}/user/${tourId}`;
        return this.http.get<any[]>(url); // Gọi API trực tiếp qua HttpClient
      }
      

        
}
