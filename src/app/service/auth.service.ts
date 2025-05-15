import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserKey = 'user';
  private tokenKey = 'access_token';
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.isLoggedIn());
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private http: HttpClient) {
    if (isPlatformBrowser(this.platformId)) {
      // Cập nhật trạng thái đăng nhập ban đầu khi đang ở môi trường trình duyệt
      this.isLoggedInSubject.next(this.isLoggedIn());
    }
  }

  getWithAuthHeader(url: string): Observable<any> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(url, { headers, responseType: 'json' }); // Dùng 'json' thay vì 'blob'
  }
  

  getWithAuthHeader2(url: string, options?: any): Observable<any> {
    const token = this.getToken();

    if (!token) {
      throw new Error('Token không tồn tại. Vui lòng đăng nhập lại.');
    }

    // Thêm Authorization Header
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    // Kết hợp headers vào options
    const requestOptions = { ...options, headers };

    // Gửi GET request
    return this.http.get(url, requestOptions);
  }


getWithAuthHeaderFull<T>(url: string, options?: { params?: HttpParams }): Observable<T> {
  const token = localStorage.getItem('access_token'); // Lấy token từ localStorage
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

  const httpOptions = {
    headers,
    ...options, // Bao gồm params nếu có
  };

  return this.http.get<T>(url, httpOptions); // Sử dụng generic T ở đây
}


  postWithAuthHeader(url: string, body: any): Observable<any> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(url, body, { headers });
  }

  putWithAuthHeader(url: string, body: any): Observable<any> {
    const token = localStorage.getItem('access_token'); // Lấy token từ localStorage
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put(url, body, { headers }); // Gửi yêu cầu PUT
  }

  deleteWithAuthHeader(url: string): Observable<any> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete(url, { headers });
  }

  isLoggedIn(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      const hasUser = !!localStorage.getItem(this.currentUserKey);
      const hasToken = !!localStorage.getItem(this.tokenKey);
      console.log('Kiểm tra đăng nhập:', { hasUser, hasToken });
      return hasUser && hasToken;
    }
    return false; // Mặc định trả về false nếu không phải trình duyệt
  }

  getLoggedInUser(): any {
  if (isPlatformBrowser(this.platformId)) {
    const user = localStorage.getItem(this.currentUserKey);
    console.log('User in localStorage:', user);
    try {
      const parsed = user ? JSON.parse(user) : null;
      return parsed?.data || null;
    } catch (error) {
      console.error('Error parsing user from localStorage', error);
      return null;
    }
  }
  return null;
}


  saveLoggedInUser(user: any): void {
    if (isPlatformBrowser(this.platformId)) {
      if (user) {
        localStorage.setItem(this.currentUserKey, JSON.stringify(user));
        this.isLoggedInSubject.next(true); // Cập nhật trạng thái đăng nhập
      }
    }
  }

  saveToken(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      console.log('Lưu token:', token);
      localStorage.setItem(this.tokenKey, token);
    }
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem(this.tokenKey);
      console.log('Token in localStorage:', token); 
      return token;
    }
    return null;
  }

  login(user: any): void {
    this.saveLoggedInUser(user);
    this.isLoggedInSubject.next(true); // Phát sự kiện đăng nhập
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.currentUserKey);
      localStorage.removeItem(this.tokenKey); // Xóa token khi đăng xuất
      this.isLoggedInSubject.next(false); // Phát sự kiện đăng xuất
    }
  }
}
