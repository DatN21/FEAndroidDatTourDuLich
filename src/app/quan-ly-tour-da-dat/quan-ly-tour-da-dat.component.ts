import { Component, OnInit } from '@angular/core';
import {BookingService} from '../service/booking.service'
import {Booking} from '../model/booking'
import { Router } from '@angular/router';
import { response } from 'express';
import { CommonModule } from '@angular/common';
import {AuthService} from '../service/auth.service'
@Component({
  selector: 'app-quan-ly-tour-da-dat',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quan-ly-tour-da-dat.component.html',
  styleUrl: './quan-ly-tour-da-dat.component.scss'
})
export class QuanLyTourDaDatComponent implements OnInit{
bookings: Booking[] = [];
user: any;
  currentPage: number = 0;
  itemsPerPage: number = 12;
  totalPages: number = 0;
  keyword: string = "";
  visiblePages: number[] = [];
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
    this.bookingService.getBookingsByUser(this.user.id).subscribe(
      (data) => {
        this.bookings = data;
        console.log('Bookings:', this.bookings);
      },
      (error) => {
        console.error('Error loading bookings:', error);
      }
    );
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
}
