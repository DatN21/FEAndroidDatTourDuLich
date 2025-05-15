import { Component, importProvidersFrom, OnInit } from '@angular/core';
import {BookingService} from '../service/booking.service'
import {Booking} from '../model/booking'
import { BookingResponseByUser } from '../response/BookingResponseByUser';
import { Router } from '@angular/router';
import { response } from 'express';
import { CommonModule } from '@angular/common';
import {AuthService} from '../service/auth.service'
import { FormsModule } from '@angular/forms';
import { throwIfEmpty } from 'rxjs';
import {ApiResponse} from '../response/APIResponse'
import {BookingDetailResponseByBookingId} from '../response/BookingDetailResponseByBookingId'
@Component({
  selector: 'app-quan-ly-tour-da-dat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './quan-ly-tour-da-dat.component.html',
  styleUrl: './quan-ly-tour-da-dat.component.scss'
})
export class QuanLyTourDaDatComponent implements OnInit{
bookingByUserId: BookingResponseByUser[] = []; //danh sách gốc (từ API)
bookingsFiltered: BookingResponseByUser[] = []; //danh sách đã lọc (theo từ khoá)
selectedStatus: string = 'all'; // Trạng thái đã chọn
bookingDetail!: BookingDetailResponseByBookingId;
showDetailModal: boolean = false;
user: any;
  currentPage: number = 1;
  itemsPerPage: number = 12;
  totalPages: number = 0;
  keyword: string = "";
  visiblePages: number[] = [];
  displayGender: string = '';
  constructor(private bookingService: BookingService, private router: Router, private authService: AuthService) {}
  ngOnInit() {
    this.user = this.authService.getLoggedInUser();
    console.log('Logged in user:', this.user); // Kiểm tra giá trị `user` từ localStorage
  
    if (this.user && this.user.id) {
      this.getBookings();
    } else {
      console.error('User not found or invalid user ID');
      this.router.navigate(['/login']); // Điều hướng nếu không có thông tin người dùng
    }
  }
  


  getBookings(): void {
    this.bookingService.getBookingsByUser(this.user.id).subscribe({
      next: (data) => {
        this.bookingByUserId = data;
        this.bookingsFiltered = [...this.bookingByUserId]; // Khởi tạo danh sách hiển thị
        this.totalPages = Math.ceil(this.bookingsFiltered.length / this.itemsPerPage);
        this.visiblePages = this.generateVisiblePageArray(this.currentPage, this.totalPages);
      },
      error: (error) => {
        console.error('Error loading bookings:', error);
      }
    });
  }
  
  
  filterByStatus() {
    if (this.selectedStatus === 'all') {
      this.bookingsFiltered = [...this.bookingByUserId];
    } else {
      this.bookingsFiltered = this.bookingByUserId.filter(b => b.status === this.selectedStatus);
    }
    this.totalPages = Math.ceil(this.bookingsFiltered.length / this.itemsPerPage);
    this.currentPage = 1;
    this.visiblePages = this.generateVisiblePageArray(this.currentPage, this.totalPages);
  }
  
  generateVisiblePageArray(currentPage: number, totalPages: number): number[] {
    const maxVisiblePages = 5;
    const halfVisiblePages = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(currentPage - halfVisiblePages, 0);
    let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(endPage - maxVisiblePages + 1, 1);
    }

    return new Array(endPage - startPage + 1).fill(0).map((_, index) => startPage + index);
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.getBookings();
  }

  editBooking(bookingId: number) {
    this.router.navigate(['/booking-edit', bookingId]);
  }
  
  // cancelBooking(bookingId: number) {
  //   if (confirm('Bạn có chắc muốn huỷ tour này?')) {
  //     // Gọi service để huỷ (nếu có), sau đó cập nhật danh sách
  //     this.bookingService.cancelBooking(bookingId).subscribe(() => {
  //       this.getBookings(); // Giả sử bạn có hàm load lại danh sách
  //     });
  //   }
  // }
 mapTextToEnum(text: string): string {
  const t = text.trim().toUpperCase();

  switch (t) {
    case 'PAID':
      return 'ĐÃ THANH TOÁN';
    case 'CONFIRMED':
      return 'ĐÃ XÁC NHẬN'
    case 'CANCELLED':
      return 'ĐÃ HUỶ';
    default:
      return 'HOÀN TIỀN';
  }
}

onStatusChange(status:string) {
  this.user.gender = this.mapTextToEnum(status);
}

viewDetail(bookingId: number) {
  this.bookingService.getBookingDetailByBookingId(bookingId).subscribe({
    next: (response: ApiResponse<BookingDetailResponseByBookingId>) => {
      this.bookingDetail = response.data;
      this.showDetailModal = true;
      console.log('Booking detail received:', this.bookingDetail);
    },
    error: (err: any) => {
      console.error('Failed to fetch booking detail', err);
    }
  });
}

}
