import { Injectable } from '@angular/core';
import { HttpClient, HttpParams,HttpHeaders,HttpEventType,HttpEvent,HttpErrorResponse} from '@angular/common/http';
import { Observable } from 'rxjs';
import { enviroment } from '../enviroments/enviroments';
import {  Tour } from '../model/tour';
import { TourCreateDTO } from '../dtos/user/tourDTO/tour-create.dto';
import { catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs'; 
@Injectable({
  providedIn: 'root'
})
export class TourService {
  private apiUrl = `${enviroment.apiBaseUrl}/tours`;

  constructor(private http: HttpClient) { }

  getTours(keyword:string, 
              page: number, limit: number
    ): Observable<Tour[]> {
    const params = new HttpParams()
      .set('keyword', keyword)
      .set('page', page.toString())
      .set('limit', limit.toString());            
    return this.http.get<Tour[]>(this.apiUrl, { params });
  }
  getDetailTour(TourId: number) {
    return this.http.get(`${enviroment.apiBaseUrl}/tours/${TourId}`);
  }
  getToursByIds(toursIds: number[]): Observable<Tour[]> {
    // Chuyển danh sách ID thành một chuỗi và truyền vào params
    debugger
    const params = new HttpParams().set('ids', toursIds.join(',')); 
    return this.http.get<Tour[]>(`${this.apiUrl}/by-ids`, { params });
  }

  addTour(tour: TourCreateDTO): Observable<TourCreateDTO> {
    return this.http.post<TourCreateDTO>(this.apiUrl, tour);
  }


   // Method to upload images
// Method to upload images in the TourService
uploadImages(tourId: number, files: File[]): Observable<any> {
  const formData: FormData = new FormData();
  
  // Append each file to FormData with the key 'files'
  files.forEach(file => {
    formData.append('files', file, file.name);
  });

  // Send the files to the backend
  return this.http.post<any>(`${this.apiUrl}/uploads/${tourId}`, formData).pipe(
    map(response => response),  // Return the backend response directly if needed
    catchError(this.handleError)
  );
}


  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error.message);
    return throwError(() => new Error('Something went wrong, please try again later.'));
  }

  updateTour(id: number, tour: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, tour);
  }
   // Lấy danh sách ảnh của tour
   getTourImages(tourId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${tourId}/images`);
  }
   // Xoá một ảnh
   deleteTourImage(imageId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/images/${imageId}`);
    
  }
  // Xoá tất cả ảnh
  deleteAllTourImages(tourId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${tourId}/images`);
  }
}



