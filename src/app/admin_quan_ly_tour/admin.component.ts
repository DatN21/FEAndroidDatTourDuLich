import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TourService } from '../service/tours.service';
import { Tour } from '../model/tour';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
// import {ThemMoiTourComponent} from '../them-moi-tour/them-moi-tour.component'
// import { environment } from '../; // Kiểm tra lại tên file này
import { QuanLyTourComponent } from '../quan-ly-tour/quan-ly-tour.component'; // Đảm bảo đúng tên component
import {QuanLyBookingComponent} from '../quan-ly-booking/quan-ly-booking.component'
import {ThemMoiTourComponent} from '../them-moi-tour/them-moi-tour.component'
import {SuaThongTinTourComponent} from '../sua-thong-tin-tour/sua-thong-tin-tour.component'
import {TourDetailComponent} from '../tour-detail/tour-detail.component'
import {QuanLyNguoiDungComponent} from '../quan-ly-nguoi-dung/quan-ly-nguoi-dung.component'
import { QuanLyCtkmComponent } from '../quan-ly-ctkm/quan-ly-ctkm.component';
@Component({
  selector: 'app-admin-quan-ly-tour',
  standalone: true,
  imports: [CommonModule, RouterModule,QuanLyNguoiDungComponent, QuanLyTourComponent,QuanLyBookingComponent,ThemMoiTourComponent,SuaThongTinTourComponent,TourDetailComponent, QuanLyCtkmComponent],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'] // Sửa thành styleUrls
})
export class AdminComponent implements OnInit{
  tours: Tour[] = [];                // Danh sách tour
  currentPage: number = 1;            // Trang hiện tại
  itemsPerPage: number = 12;          // Số tour trên mỗi trang
  totalPages: number = 0;             // Tổng số trang
  visiblePages: number[] = [];        // Các trang hiển thị
  keyword: string = "";               // Từ khóa tìm kiếm

  constructor(
    private tourService: TourService, // Dịch vụ lấy dữ liệu tour
    private router: Router             // Dịch vụ điều hướng
  ) {}

  isSidebarOpen = true;

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }


  ngOnInit() {
    // this.getTours(this.keyword, this.currentPage, this.itemsPerPage);
  }

  // getTours(keyword: string, page: number, limit: number) {
  //   this.tourService.getTours(keyword, page, limit).subscribe({
  //     next: (response: any) => {
  //       if (response && response.tourResponses) { // Kiểm tra response.tourResponses thay vì response.tours
  //         this.tours = response.tourResponses.map((tour: Tour) => ({
  //           ...tour,
  //           thumbnailUrl: `${enviroment.apiBaseUrl}/images/${tour.thumbnail}` // Đảm bảo đúng chính tả
  //         }));
  //         this.totalPages = response.totalPages ;
  //         this.visiblePages = this.generateVisiblePageArray(this.currentPage, this.totalPages);
  //       } else {
  //         console.error("Cấu trúc phản hồi từ backend không đúng:", response);
  //       }
  //     },
  //     error: (error: any) => {
  //       console.error('Lỗi khi lấy dữ liệu tour:', error);
  //     }
  //   });
  // }
  
  // // Hàm thay đổi trang hiện tại
  // onPageChange(page: number) {
  //   this.currentPage = page;
  //   this.getTours(this.keyword, this.currentPage, this.itemsPerPage);
  // }

  // // Hàm tạo mảng các trang có thể hiển thị
  // generateVisiblePageArray(currentPage: number, totalPages: number): number[] {
  //   const maxVisiblePages = 5;
  //   const halfVisiblePages = Math.floor(maxVisiblePages / 2);

  //   let startPage = Math.max(currentPage - halfVisiblePages, 1);
  //   let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

  //   if (endPage - startPage + 1 < maxVisiblePages) {
  //     startPage = Math.max(endPage - maxVisiblePages + 1, 1);
  //   }

  //   return new Array(endPage - startPage + 1).fill(0).map((_, index) => startPage + index);
  // }

  // // Điều hướng đến trang chi tiết tour khi người dùng nhấn vào tour
  // onTourClick(tourId: number) {
  //   this.router.navigate(['/tours', tourId]);
  // }
}
