import { Component, OnInit } from '@angular/core';
import {BookingService} from '../service/booking.service'
import {Booking} from '../model/booking'
import { Router } from '@angular/router';
import { response } from 'express';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';  // Import FormsModule
@Component({
  selector: 'app-quan-ly-bookings',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './quan-ly-booking.component.html',
  styleUrls: ['./quan-ly-booking.component.scss']
})
export class QuanLyBookingComponent implements OnInit {
  bookings: Booking[] = [];
  successMessage: string = '';
  errorMessage: string = '';
  currentPage: number = 0;
  itemsPerPage: number = 12;
  totalPages: number = 0;
  keyword: string = "";
  visiblePages: number[] = []

  isUpdateFormVisible: boolean = false;
  selectedBooking: Booking | null = null;

  constructor(private bookingService: BookingService, private router: Router) {}
  ngOnInit() {
    this.getBookings( this.currentPage, this.itemsPerPage);
  }

  
  getBookings(page: number, limit: number) {
    this.bookingService.getAllBookings(page, limit).subscribe({
      next: (response: any) => {
        if (response && response.bookingResponses) {
          // Sắp xếp danh sách bookings theo ngày đặt, booking mới nhất lên trước
          this.bookings = response.bookingResponses
            .map((booking: Booking) => ({
              ...booking,
              // Xử lý bổ sung nếu cần, ví dụ: thêm URL hình ảnh
            }))
            .sort((a: Booking, b: Booking) => {
              const dateA = new Date(a.booking_time);  // Thay 'bookingDate' bằng trường ngày đặt trong model
              const dateB = new Date(b.booking_time);
              return dateB.getTime() - dateA.getTime();  // Sắp xếp giảm dần (mới nhất lên trước)
            });
  
          this.totalPages = response.totalPages;
          this.visiblePages = this.generateVisiblePageArray(this.currentPage, this.totalPages);
        } else {
          console.error("Cấu trúc phản hồi từ backend không đúng:", response);
        }
      },
      error: (error: any) => {
        console.error('Lỗi khi lấy dữ liệu booking:', error);
      }
    });
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
    this.getBookings( this.currentPage, this.itemsPerPage);
  }

  onDelete(bookingId: number) {
    if (confirm('Bạn có chắc chắn muốn xóa booking này?')) {
      this.bookingService.deleteBooking(bookingId).subscribe({
        next: () => {
          this.successMessage = 'Booking đã được xóa thành công!';
          this.errorMessage = '';
          this.getBookings(this.currentPage, this.itemsPerPage); // Refresh lại danh sách sau khi xóa
        },
        error: (error: any) => {
          this.errorMessage = 'Đã xảy ra lỗi khi xóa booking.';
          console.error('Lỗi khi xóa booking:', error.message || error); // Hiển thị thông báo lỗi rõ ràng
          alert('Xóa booking thất bại. Vui lòng thử lại.');
        }
      });
    }
  }
  

  openUpdateForm(booking: Booking) {
    this.selectedBooking = { ...booking };
    this.isUpdateFormVisible = true;
  }
  
  closeUpdateForm() {
    this.isUpdateFormVisible = false;
    this.selectedBooking = null;
  }

updateBookingStatus() {
  if (this.selectedBooking && this.selectedBooking.status) {
    this.bookingService.updateBookingStatus(this.selectedBooking.id, this.selectedBooking.status).subscribe({
      next: (response) => {
        this.successMessage = 'Cập nhật trạng thái booking thành công!';
        this.getBookings(this.currentPage, this.itemsPerPage); // Refresh danh sách booking
        this.closeUpdateForm();
      },
      error: (error) => {
        this.errorMessage = 'Cập nhật trạng thái booking thất bại.';
        console.error(error);
      }
    });
  }
  
}
}
