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
  displayGender: string = '';
  constructor(
    private authService: AuthService,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getLoggedInUser();
    this.isAdmin = this.user.roleId === '2'; // Kiểm tra quyền của người dùng
    if(this.user){
       this.displayGender = this.mapEnumToText(this.user.gender) ;
    }
  }

  viewBookedTours(): void {
    // Điều hướng đến trang quản lý tour đã đặt
    this.router.navigate(['/quan-ly-tour-da-dat']);
  }

updateAccount(): void {
  if (!this.isAdmin) {
    this.userService.updateUser(this.user.id, this.user).subscribe({
      next: (response) => {
        this.successMessage = 'Thông tin đã được cập nhật!';
        this.editableRowId = null;
        this.authService.saveLoggedInUser(response);  // Cập nhật thông tin người dùng mới

        // Ẩn thông báo sau 3 giây
        setTimeout(() => {
          this.successMessage = '';
        }, 1500);
      },
      error: (error) => {
        console.error('Lỗi khi cập nhật :', error);
        this.errorMessage = 'Cập nhật không thành công, vui lòng thử lại!';

        // Ẩn thông báo lỗi sau 5 giây
        setTimeout(() => {
          this.errorMessage = '';
        }, 2000);
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


mapEnumToText(gender: string): string {
  return gender === 'NAM' ? 'Nam' : gender === 'NU' ? 'Nữ' : '';
}

mapTextToEnum(text: string): string {
  const t = text.trim().toLowerCase();
  return t === 'nam' ? 'NAM' : t === 'nữ' || t === 'nu' ? 'NU' : 'OTHER';
}

onGenderChange() {
  this.user.gender = this.mapTextToEnum(this.displayGender);
}

}
