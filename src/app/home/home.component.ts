import { Component,OnInit, ViewChild } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { FooterComponent } from "../footer/footer.component";
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { UserService } from '../service/user.service';
import { RegisterDTO } from '../dtos/user/register.dto';
import { Tour } from '../model/tour';
import { TourService } from '../service/tours.service';
import { enviroment } from '../enviroments/enviroments';
@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [HeaderComponent, FooterComponent, FormsModule, CommonModule, RouterModule],
})
export class HomeComponent implements OnInit {
  tours: Tour[] = [];                // Danh sách tour
  currentPage: number = 0;            // Trang hiện tại
  itemsPerPage: number = 12;          // Số tour trên mỗi trang
  totalPages: number = 0;             // Tổng số trang
  visiblePages: number[] = [];        // Các trang hiển thị
  keyword: string = "";               // Từ khóa tìm kiếm

  constructor(
    private tourService: TourService, // Dịch vụ lấy dữ liệu tour
    private router: Router             // Dịch vụ điều hướng
  ) {}

  ngOnInit() {
    this.getTours(this.keyword, this.currentPage, this.itemsPerPage);
  }

  // Hàm lấy danh sách tour theo từ khóa, trang và số lượng tour trên trang
// Hàm lấy danh sách tour theo từ khóa, trang và số lượng tour trên trang
getTours(keyword: string, page: number, limit: number) {
  this.tourService.getTours(keyword, page, limit).subscribe({
    next: (response: any) => {
      if (response && response.tourResponses) { // Kiểm tra response.tourResponses thay vì response.tours
        this.tours = response.tourResponses.map((tour: Tour) => ({
          ...tour,
          // thumbnailUrl: `${enviroment.apiBaseUrl}/images/${tour.thumbnail}` // Đảm bảo đúng chính tả
        }));
        this.totalPages = response.totalPages ;
        this.visiblePages = this.generateVisiblePageArray(this.currentPage, this.totalPages);
      } else {
        console.error("Cấu trúc phản hồi từ backend không đúng:", response);
      }
    },
    error: (error: any) => {
      console.error('Lỗi khi lấy dữ liệu tour:', error);
    }
  });
}


  // Hàm tìm kiếm tour mới
  searchTours() {
    this.currentPage = 1;
    this.getTours(this.keyword, this.currentPage, this.itemsPerPage);
  }

  // Hàm thay đổi trang hiện tại
  onPageChange(page: number) {
    this.currentPage = page;
    this.getTours(this.keyword, this.currentPage, this.itemsPerPage);
  }

  // Hàm tạo mảng các trang có thể hiển thị
  generateVisiblePageArray(currentPage: number, totalPages: number): number[] {
    const maxVisiblePages = 5;
    const halfVisiblePages = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(currentPage - halfVisiblePages, 1);
    let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(endPage - maxVisiblePages + 1, 1);
    }

    return new Array(endPage - startPage + 1).fill(0).map((_, index) => startPage + index);
  }

  // Điều hướng đến trang chi tiết tour khi người dùng nhấn vào tour
  onTourClick(tourId: number) {
    this.router.navigate(['/tours', tourId]);
  }
  goToTourDetail(tourId: string): void {
    this.router.navigate(['/tour-detail', tourId]); // Điều hướng đến trang chi tiết tour
  }
}
