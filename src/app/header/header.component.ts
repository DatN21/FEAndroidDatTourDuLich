import { Component, Inject, OnInit, PLATFORM_ID ,HostListener } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { RouterModule } from '@angular/router';
import {AuthService} from '../service/auth.service'
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule,CommonModule,],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit{
  isLoggedIn: boolean = false;
  userName: string = '';
  isScrolled = false;
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Kiểm tra trạng thái đăng nhập khi trang được tải lại
    this.isLoggedIn = this.authService.isLoggedIn(); // Gọi trực tiếp hàm isLoggedIn()
    if (this.isLoggedIn) {
      const user = this.authService.getLoggedInUser();
      this.userName = user?.name || 'TÀI KHOẢN';
    } else {
      this.userName = '';
    }
  
    // Lắng nghe thay đổi trạng thái đăng nhập
    this.authService.isLoggedIn$.subscribe((status) => {
      this.isLoggedIn = status;
      console.log('Đăng nhập thành công:', this.isLoggedIn);
  
      if (this.isLoggedIn) {
        const user = this.authService.getLoggedInUser();
        console.log('Thông tin người dùng lấy từ localStorage:', user);
        this.userName = user?.name || 'TÀI KHOẢN';
      } else {
        this.userName = '';
        console.log('Người dùng không đăng nhập, userName:', this.userName);
      }
    });

}
@HostListener('window:scroll', [])
onWindowScroll(): void {
  const scrollY = window.scrollY || document.documentElement.scrollTop;
  console.log('Scroll Y:', scrollY);

  // Kiểm tra vị trí cuộn và thay đổi trạng thái `isScrolled`
  this.isScrolled = scrollY > 50;
}
}
