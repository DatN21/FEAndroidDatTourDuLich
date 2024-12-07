import { Injectable } from '@angular/core';
import { HttpClient, HttpParams,HttpHeaders,HttpEventType,HttpEvent,HttpErrorResponse} from '@angular/common/http';
import { Observable } from 'rxjs';
import { enviroment } from '../enviroments/enviroments';
import {  Tour } from '../model/tour';
import { TourCreateDTO } from '../dtos/user/tourDTO/tour-create.dto';
import { catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs'; 
import {AuthService} from '../service/auth.service'
@Injectable({
  providedIn: 'root'
})
export class TourService {
  private apiUrl = `${enviroment.apiBaseUrl}/tours`;
  private apiUrlGetTourIMG =  `${enviroment.apiBaseUrl}/tours/uploads`;
  constructor(private http: HttpClient,private authService:AuthService) { }

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
    return this.authService.postWithAuthHeader(this.apiUrl,tour);
  }


   // Method to upload images
// Method to upload images in the TourService
uploadImages(tourId: number, files: File[]): Observable<any> {
  const formData: FormData = new FormData();
  
  // Append each file to FormData with the key 'files'
  files.forEach(file => {
    formData.append('files', file, file.name);
  });
  
  const url = `${this.apiUrl}/uploads/${tourId}`;
  
  // Send the files to the backend
  return this.authService.postWithAuthHeader(url, formData).pipe(
    map(response => response),  // Return the backend response directly if needed
    catchError(this.handleError)  // Handle any errors
  );
}


  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error.message);
    return throwError(() => new Error('Something went wrong, please try again later.'));
  }

  updateTour(id: number, tour: any): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.authService.putWithAuthHeader(url, tour);
  }

   // Xoá một ảnh
   deleteTour(id: number): Observable<void> {
    const urlDelete =`${this.apiUrl}/${id}`
    return this.authService.deleteWithAuthHeader(urlDelete);
  }
  // Xoá tất cả ảnh
  deleteAllTourImages(tourId: number): Observable<void> {
    const urlDelete = `${this.apiUrl}/${tourId}/images` ;
    return this.authService.deleteWithAuthHeader(urlDelete);
  }

  getImagesByTourId(tourId: number, page: number, size: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${tourId}?page=${page}&size=${size}`);
  }

      getToursFull(keyword:string, 
        page: number, limit: number
    ): Observable<Tour[]> {
    const params = new HttpParams()
    .set('keyword', keyword)
    .set('page', page.toString())
    .set('limit', limit.toString());            
    return this.authService.getWithAuthHeaderFull(`${this.apiUrl}/full`,{ params });
    }
}



