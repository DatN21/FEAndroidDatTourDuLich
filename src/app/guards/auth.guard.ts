import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../service/auth.service'; // Đảm bảo rằng bạn có một dịch vụ auth để kiểm tra phân quyền

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    
    const currentUser = this.authService.getLoggedInUser(); // Giả sử bạn có phương thức này để lấy quyền của người dùng
    if (currentUser && currentUser.roleId === 'ADMIN') {
      return true; // Nếu là admin, cho phép truy cập
    } else {
      this.router.navigate(['/']); // Nếu không phải admin, chuyển hướng về trang chủ
      return false; // Không cho phép truy cập
    }
  }
}
