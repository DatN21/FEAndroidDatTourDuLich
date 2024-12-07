import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../service/auth.service';
import { enviroment } from '../enviroments/enviroments'; // Sửa lại tên import cho đúng

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private apiUrl = `${enviroment.apiBaseUrl}/admin`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Lấy ảnh theo tourId với phân trang
  getImagesByTourId(tourId: number, page: number, size: number): Observable<any> {
    const url = `${this.apiUrl}/images/${tourId}`;
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.authService.getWithAuthHeaderFull(url, { params });
  }

  // Lấy ảnh đầy đủ theo URL với token

  getImageWithToken(imgUrl: string): Observable<Blob> {
    const url = `${this.apiUrl}/images/full/${imgUrl}`;
    return this.authService.getWithAuthHeader2(url, { responseType: 'blob' });
  }

  // Xóa ảnh theo imageId
  deleteImage(imageId: number): Observable<void> {
    const urlDelete = `${this.apiUrl}/images/${imageId}`;
    return this.authService.deleteWithAuthHeader(urlDelete);
  }
}
