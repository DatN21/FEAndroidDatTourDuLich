import { Component, ViewChild } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { FooterComponent } from "../footer/footer.component";
import { RouterModule } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { LoginDTO } from '../dtos/user/login.dto';
import { Router } from '@angular/router';
import { UserService ,} from '../service/user.service';
import { tap } from 'rxjs/operators';
import {TokenService} from '../service/token.service'
import {UserResponse} from '../response/user.response'
import {AuthService} from '../service/auth.service'

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, RouterModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'] // Đổi thành styleUrls
})
export class LoginComponent {
  @ViewChild('loginForm') loginForm!: NgForm;

  phone: string = '';
  password: string = '';
  successMessage: string = '';
  rememberMe: boolean = true ;
  userResponse?: UserResponse
  constructor(private router: Router, private userService: UserService,private tokenService: TokenService, private authService: AuthService) {}

  // Ghi lại giá trị hiện tại của điện thoại mỗi khi nó thay đổi
  onPhoneChange() {
    console.log(`Phone typed: ${this.phone}`);
  }

// Phương thức đăng nhập
// Phương thức đăng nhập
login() {
  // Chuẩn bị dữ liệu để gửi lên backend
  const loginDTO: LoginDTO = {
    phone: this.phone,
    password: this.password,
  };

  // Gọi API đăng nhập từ userService
  this.userService.login(loginDTO).subscribe({
    next: (response: any) => {
      // Hiển thị thông báo từ phản hồi backend
      

      // Lấy token từ phản hồi
      const token = response; 

      // Nếu người dùng chọn "Remember Me", lưu token vào storage
      if (this.rememberMe) {
        this.tokenService.setToken(token);
      }
      // if (!token) {
      //   console.error('Không tìm thấy token trong phản hồi:', response);
      //   return;
      // }
      if (response?.token) {
        this.authService.saveToken(response.token);
      } else {
        console.error('Token không tồn tại trong phản hồi:', response);
      }
      

      // Gọi API lấy thông tin chi tiết người dùng
      this.userService.getUserDetail(token).subscribe({
        next: (userResponse: any) => {
          // Lưu thông tin người dùng vào localStorage
          console.log('Dữ liệu người dùng nhận được:', userResponse);
          this.userResponse = {
            ...userResponse,
          };

          this.userService.saveUserResponseToLocalStorage(this.userResponse);
          this.authService.saveLoggedInUser(this.userResponse);

          // Điều hướng dựa trên vai trò người dùng
          if (this.userResponse?.roleId === 'ADMIN') {
            this.router.navigate(['/admin']); // Trang quản trị
          } else if (this.userResponse?.roleId === 'USER') {
            this.router.navigate(['/']); // Trang dành cho người dùng
          } else {
            console.warn('Vai trò người dùng không xác định.');
            this.router.navigate(['/']); // Trang mặc định
          }
        },
        error: (error: any) => {
          console.error('Lỗi khi lấy thông tin chi tiết người dùng:', error.message || error);
          alert('Không thể lấy thông tin người dùng. Vui lòng thử lại.');
        },
      });

      // Xóa thông tin đăng nhập để bảo mật
      this.phone = '';
      this.password = '';
      this.loginForm.resetForm(); // Đặt lại form
    },
    error: (error: any) => {
      // Xử lý lỗi đăng nhập
      const errorMessage = error.error?.message || `Lỗi đăng nhập: ${error.message}`;
      console.error('Phản hồi từ backend (error):', errorMessage);
      alert(errorMessage);
    },
  });
}


}
