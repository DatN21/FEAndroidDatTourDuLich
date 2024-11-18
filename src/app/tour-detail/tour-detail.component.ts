import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { FooterComponent } from "../footer/footer.component";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators ,ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingService } from '../service/booking.service';
import { TourService } from '../service/tours.service';
import { BookingDTO } from '../dtos/user/booking/booking.dto';

@Component({
  selector: 'app-tour-detail',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, FormsModule, CommonModule, RouterModule,ReactiveFormsModule],
  templateUrl: './tour-detail.component.html',
  styleUrls: ['./tour-detail.component.scss']
})
export class TourDetailComponent implements OnInit {
  bookingForm!: FormGroup;
  tour: any = {}; // Chứa thông tin tour
  tourId!: number; // ID tour từ URL
  userId!: number; // ID người dùng từ localStorage
  tourName: string = 'test'; // Tên tour
  pricePerPerson: number = 1000; // Giá mỗi người
  totalPrice: number = 0; // Tổng tiền
  errorMessage: string = ''; // Lỗi khi tải dữ liệu
  successMessage: string = ''; // Thông báo thành công

  constructor(
    private fb: FormBuilder,
    private bookingService: BookingService,
    private tourService: TourService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Lấy tourId từ URL
    const tourId = Number(this.route.snapshot.params['id']);
    if (tourId) {
      this.tourId = tourId;
      this.fetchTourDetails(tourId);
    } else {
      this.errorMessage = 'Không tìm thấy thông tin tour.';
    }

    // Lấy thông tin người dùng từ localStorage
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    this.userId = userData.id || 9; // Mặc định là 1 nếu không có user

    // Khởi tạo form với các trường dữ liệu
    this.bookingForm = this.fb.group({
      amount: [1, [Validators.required, Validators.min(1)]], // Số khách >= 1
      start_date: ['', Validators.required], // Không được để trống
      name: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)]], // Chỉ chứa chữ cái và khoảng trắng
      phone: ['', [Validators.required, Validators.pattern(/^(0[3|5|7|8|9])+([0-9]{8})$/)]], // Định dạng số điện thoại VN
      email: ['', [Validators.required, Validators.email]], // Định dạng email
      notes: [''] // Không bắt buộc
    });

    // Lắng nghe sự thay đổi của số lượng khách để tính lại tổng tiền
    this.bookingForm.get('amount')?.valueChanges.subscribe((amount) => {
      this.totalPrice = this.calculateTotalPrice(amount);
    });

    // Thiết lập tổng tiền mặc định khi chưa thay đổi số khách
    this.totalPrice = this.calculateTotalPrice(1);
  }

  // Hàm tính tổng tiền dựa trên số lượng khách
  calculateTotalPrice(amount: number): number {
    return amount * this.pricePerPerson;
  }

  // Gửi yêu cầu đặt tour
  onSubmit(): void {
    if (this.bookingForm.invalid) {
      alert('Vui lòng kiểm tra thông tin đặt tour.');
      return;
    }

    const bookingData: BookingDTO = {
      user_id: this.userId,
      tour_id: this.tourId,
      tour_name: this.tourName,
      amount: this.bookingForm.value.amount,
      start_date: this.bookingForm.value.start_date,
      total_price: this.totalPrice,
      status: 'Đang chờ xử lý',
      payment_method: this.bookingForm.value.payment_method,
      notes: this.bookingForm.value.notes || ''
    };

    // Gửi dữ liệu đặt tour đến API
    this.bookingService.createBooking(bookingData).subscribe({
      next: () => {
        alert('Đặt tour thành công!');
        this.router.navigate(['/']); // Chuyển hướng về trang chủ sau khi đặt tour thành công
      },
      error: (err) => {
        console.error(err);
        alert('Đặt tour thất bại. Vui lòng thử lại.');
      }
    });
  }

  // Lấy thông tin chi tiết tour
  fetchTourDetails(tourId: number): void {
    this.tourService.getDetailTour(tourId).subscribe({
      next: (data) => {
        this.tour = data;
        // this.tourName = data.name; // Lưu tên tour từ dữ liệu nhận được
      },
      error: (err) => {
        this.errorMessage = 'Không thể tải thông tin tour.';
      }
    });
  }
}
