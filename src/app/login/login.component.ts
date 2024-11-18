import { Component, ViewChild } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { FooterComponent } from "../footer/footer.component";
import { RouterModule } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { LoginDTO } from '../dtos/user/login.dto';
import { Router } from '@angular/router';
import { UserService } from '../service/user.service';

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

  constructor(private router: Router, private userService: UserService) {}

  // Ghi lại giá trị hiện tại của điện thoại mỗi khi nó thay đổi
  onPhoneChange() {
    console.log(`Phone typed: ${this.phone}`);
  }

  // Phương thức đăng nhập
  login() {
    const loginDTO: LoginDTO = {
      phone: this.phone,
      password: this.password,
    };

    this.userService.login(loginDTO).subscribe({
      next: (response: any) => {
        this.successMessage = 'Đăng nhập thành công!'; // Đổi thành "Đăng nhập"

        // Xóa các giá trị đã nhập trong form
        this.phone = '';
        this.password = '';

        this.loginForm.resetForm(); // Reset form

        // Điều hướng đến trang chính hoặc trang khác tùy theo yêu cầu
        this.router.navigate(['']); // Thay '/home' thành trang cần điều hướng sau khi đăng nhập thành công
      },
      error: (error) => {
        const errorMessage = error.error?.message || `Cannot login, error: ${error.message}`;
        alert(errorMessage); // Hiển thị thông báo lỗi phù hợp
      }
    });
  }
}
