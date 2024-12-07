import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';
import { UserService } from '../service/user.service';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-thong-tin-tai-khoan',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './thong-tin-tai-khoan.component.html',
  styleUrls: ['./thong-tin-tai-khoan.component.scss'],
})
export class ThongTinTaiKhoanComponent implements OnInit {
  user: any;
  userDTOUpdate: any = {};
  isAdmin: boolean = false; 
  editableRowId: number | null = null;
  successMessage: string = '';
  errorMessage: string = '';
  constructor(
    private authService: AuthService,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getLoggedInUser();
    this.isAdmin = this.user.roleId === 'ADMIN'; // Kiểm tra quyền của người dùng
  }

  viewBookedTours(): void {
    // Điều hướng đến trang quản lý tour đã đặt
    this.router.navigate(['/quan-ly-tour-da-dat']);
  }

  updateAccount(): void {
    // Cập nhật thông tin tài khoản nếu không phải admin
    if (!this.isAdmin) {
      this.userService.updateUser(this.user.id, this.user).subscribe({
        next: (response) => {
          this.successMessage = `Thông tin đã được cập nhật!`;
          this.editableRowId = null;
          this.authService.saveLoggedInUser(response);  // Cập nhật thông tin người dùng mới
        },
        error: (error) => {
          console.error('Lỗi khi cập nhật :', error);
          this.errorMessage = 'Cập nhật không thành công, vui lòng thử lại!';
        }
      });
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/dang-nhap']); // Điều hướng về trang đăng nhập
  }

  goToAdminPage(): void {
    // Chuyển đến trang quản trị nếu người dùng là admin
    this.router.navigate(['/admin']);
  }
}
