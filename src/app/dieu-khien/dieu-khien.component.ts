import { Component } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { FooterComponent } from "../footer/footer.component";
import { RouterModule } from '@angular/router';
import { ThongTinTaiKhoanComponent } from '../thong-tin-tai-khoan/thong-tin-tai-khoan.component';
import { AuthService } from '../service/auth.service';
import { Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common'; // Thêm CommonModule
@Component({
  selector: 'app-dieu-khien',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, RouterModule, ThongTinTaiKhoanComponent,CommonModule],
  templateUrl: './dieu-khien.component.html',
  styleUrls: ['./dieu-khien.component.scss']
})
export class DieuKhienComponent {
  isLoggedIn: boolean = false;
  userName: string | null = null;
  isAdminPage = false;

  constructor(private authService: AuthService, private router: Router) {
    // Kiểm tra trang hiện tại khi có sự kiện điều hướng
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Nếu đường dẫn bắt đầu bằng '/admin', xác định đây là trang admin
        this.isAdminPage = event.url.startsWith('/admin');
      }
    });
  }

  ngOnInit() {
    // Kiểm tra trạng thái đăng nhập khi trang được tải lại
    this.authService.isLoggedIn$.subscribe((status) => {
      this.isLoggedIn = status;
      this.userName = this.isLoggedIn ? this.authService.getLoggedInUser()?.name : null;
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']); // Điều hướng đến trang đăng nhập
  }
}
