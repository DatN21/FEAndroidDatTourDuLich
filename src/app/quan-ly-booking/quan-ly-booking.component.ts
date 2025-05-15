import { Component, OnInit } from '@angular/core';
import { BookingService } from '../service/booking.service';
import { Booking } from '../model/booking';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-quan-ly-bookings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './quan-ly-booking.component.html',
  styleUrls: ['./quan-ly-booking.component.scss']
})
export class QuanLyBookingComponent implements OnInit {
  bookings: Booking[] = [];
  pendingBookings: Booking[] = [];
  successMessage: string = '';
  errorMessage: string = '';
  currentPage: number = 0;
  itemsPerPage: number = 12;
  totalPages: number = 0;
  keyword: string = "";
  visiblePages: number[] = [];

  isUpdateFormVisible: boolean = false;
  selectedBooking: Booking | null = null;

  constructor(private bookingService: BookingService, private router: Router) {}

  ngOnInit() {
    this.getBookings(this.currentPage, this.itemsPerPage);
  }

  getBookings(page: number, limit: number) {
    this.bookingService.getAllBookings(page, limit).subscribe({
      next: (response: any) => {
        if (response && response.data.content) {
          this.bookings = response.data.content
            .map((booking: Booking) => ({ ...booking }))
            .sort((a: Booking, b: Booking) => {
              const dateA = new Date(a.createdAt);
              const dateB = new Date(b.createdAt);
              return dateB.getTime() - dateA.getTime();
            });

          this.pendingBookings = this.bookings.filter(b => b.status === 'PENDING');
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
    this.getBookings(this.currentPage, this.itemsPerPage);
  }

  onDelete(bookingId: number) {
    if (confirm('Bạn có chắc chắn muốn xóa booking này?')) {
      this.bookingService.deleteBooking(bookingId).subscribe({
        next: () => {
          this.successMessage = 'Booking đã được xóa thành công!';
          this.errorMessage = '';
          this.getBookings(this.currentPage, this.itemsPerPage);
        },
        error: (error: any) => {
          this.errorMessage = 'Đã xảy ra lỗi khi xóa booking.';
          console.error('Lỗi khi xóa booking:', error.message || error);
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
      this.bookingService.updateBookingStatus(this.selectedBooking.bookingId, this.selectedBooking.status).subscribe({
        next: () => {
          this.successMessage = 'Cập nhật trạng thái booking thành công!';
          this.getBookings(this.currentPage, this.itemsPerPage);
          this.closeUpdateForm();
        },
        error: (error) => {
          this.errorMessage = 'Cập nhật trạng thái booking thất bại.';
          console.error(error);
        }
      });
    }
  }

  getStatusLabel(status: string): string {
  switch(status) {
    case 'PAID':
      return 'Đã thanh toán';
    case 'CONFIRMED':
      return 'Đã xác nhận';
    case 'CANCELLED':
      return 'Đã huỷ';
    case 'COMPLETED':
      return 'Hoàn thành';
    case 'REFUNDED':
      return 'Đã hoàn tiền';
    default:
      return 'Chưa xác định';
  }
}

}
