import { Component, OnInit, OnDestroy } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingService } from '../service/booking.service';
import { TourService } from '../service/tours.service';
import { BookingDTO } from '../dtos/user/booking/booking.dto';
import { AuthService } from '../service/auth.service';
import { ImageService } from '../service/image.service';
import { TourResponse } from '../response/TourResponse';
import { TourByAgeResponse } from '../response/TourByAgeResponse';
import { TourScheduleResponse } from '../response/TourScheduleResponse';

@Component({
  selector: 'app-tour-detail',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, FormsModule, CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './tour-detail.component.html',
  styleUrls: ['./tour-detail.component.scss'],
})
export class TourDetailComponent implements OnInit, OnDestroy {
  selectedTour: TourResponse | null = null;
  bookingForm!: FormGroup;
  tour!: TourResponse; 
  tourId!: number; 
  tourName: string = ''; 
  loading: boolean = false;
  images: string[] = [];
  pricePerPerson: number = 0;
  totalPrice: number = 0; 
  errorMessage: string = ''; 
  successMessage: string = ''; 
  user: any;
  selectedImage: string | null = null;
  currentIndex: number = 0;
  selectedDate = 'all';
  selectedScheduleId: number | null = null;
tourAgeGroups: TourByAgeResponse[] = [];
tourSchedule: TourScheduleResponse[] = [];
tourDuration!: number;
tourDepatureLocation!: string;
  selectedBasePrice: number = 0;
  ageGroups: { describe: string; priceRate: number; price: number; count: number }[] = [];
  constructor(
    private fb: FormBuilder,
    private bookingService: BookingService,
    private tourService: TourService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private imageService: ImageService
  ) {}

 ngOnInit(): void {

  this.user = this.authService.getLoggedInUser();
  this.bookingForm = this.fb.group({
  fullName: ['', Validators.required],
  phoneNumber: ['', Validators.required],
  amount: [1, [Validators.required, Validators.min(1)]],
  start_date: ['', Validators.required],
  notes: ['']
});

  this.loadTourData(); // Gọi tất cả từ đây
}

getPriceForAgeGroup(rate: number): number {
  if (rate === 0) {
    return this.selectedBasePrice;
  }
  return this.selectedBasePrice - (this.selectedBasePrice * rate);
}

private loadTourData(): void {
    const tourId = Number(this.route.snapshot.params['id']);
  if (tourId) {
    this.tourId = tourId;

    this.fetchTourDetails(tourId);
    this.loadImages(tourId);
    this.getTourAgeGroup(); // 👈 Gọi ở đây là hợp lý
    this.getTourSchedule(tourId);

  } else {
    this.errorMessage = 'Không tìm thấy thông tin tour.';
  }
}


  private fetchTourDetails(tourId: number): void {
    this.tourService.getDetailTour(tourId).subscribe({
      next: (response) => {
        if(response && response.data) {
          this.tour = response.data;
          this.selectedTour = response.data; // 👈 thêm dòng này
          this.pricePerPerson = this.tour.price;
           this.selectedBasePrice = this.tour.price;
          this.totalPrice = this.calculateTotalPrice(this.bookingForm.value.amount);
        }
      },
      error: () => {
        this.errorMessage = 'Không thể tải thông tin tour.';
      }
    });
  }

private getTourAgeGroup(): void {
  this.tourService.getAllTourByAge().subscribe({
    next: (ageGroups: TourByAgeResponse[]) => {
      this.tourAgeGroups = ageGroups;
      this.ageGroups = ageGroups.map(group => ({
        describe: group.describe,
        priceRate: group.priceRate,
        price: this.getPriceForAgeGroup(group.priceRate),
        count: 0
      }));
    },
    error: (error) => {
      console.error('Lỗi khi tải nhóm tuổi:', error);
      this.errorMessage = 'Không thể tải thông tin nhóm tuổi.';
      this.tourAgeGroups = [];
      this.ageGroups = [];
    }
  });
}

private getTourSchedule(id:number): void {
  this.tourService.getAllTourSchedule(id).subscribe({
    next: (tourSchedule: TourScheduleResponse[]) => {
      if (tourSchedule && tourSchedule.length > 0) {
        this.tourSchedule = tourSchedule;
      }
    },
    error: (error) => {
      console.error('Lỗi khi lịch trình tour:', error);
      this.errorMessage = 'Không thể tải lịch trình tour.';
      this.tourSchedule = [];
    }
  });
}

private loadImages(id: number): void {
  this.loading = true;

  this.imageService.getImagesByTourIdArray(id).subscribe({
    next: (data) => {
      const imageRequests = data.map((img) =>
        this.imageService.getImageWithToken(img.imgUrl).toPromise()
      );

      Promise.allSettled(imageRequests)
        .then((results) => {
          const fulfilledBlobs = results
            .filter(
              (result): result is PromiseFulfilledResult<Blob> =>
                result.status === 'fulfilled' && !!result.value && result.value.size > 0
            )
            .map((result) => result.value);

          return Promise.all(fulfilledBlobs.map(this.blobToBase64));
        })
        .then((base64Images) => {
          this.images = base64Images;
        })
        .catch((err) => {
          console.error('Lỗi khi xử lý ảnh:', err);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    error: (err) => {
      console.error('Lỗi khi lấy danh sách ảnh:', err);
      this.loading = false;
    }
  });
}

private blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}




  onSubmit(): void {
    if (this.bookingForm.invalid) {
      alert('Vui lòng kiểm tra thông tin đặt tour.');
      return;
    }
  
    // Kiểm tra xem người dùng đã đăng nhập chưa
    if (!this.authService.isLoggedIn()) {
      // Nếu chưa đăng nhập, hiện thông báo yêu cầu đăng nhập và chuyển hướng đến trang đăng nhập
      alert('Bạn cần đăng nhập trước khi đặt tour.');
      this.router.navigate(['/dang-nhap']).then(() => {
        // Sau khi người dùng đăng nhập thành công, thực hiện đặt tour
        this.router.events.subscribe(() => {
          if (this.authService.isLoggedIn()) {
            this.createBooking();
          }
        });
      });
      return;
    }
  
    // Nếu đã đăng nhập, tiến hành đặt tour
    this.createBooking();
  }
  
  // Hàm để tạo booking
  createBooking(): void {
    const bookingData: BookingDTO = {
      user_id: this.user.id,
      full_name: this.bookingForm.value.fullName,
      phone_number: this.bookingForm.value.phoneNumber,
      tour_id: this.tourId,
      tour_name: this.tour.name,
      amount: this.bookingForm.value.amount,
      start_date: this.bookingForm.value.start_date,
      total_price: this.calculateTotalPrice(this.bookingForm.value.amount),
      status: 'Đang chờ xử lý',
      notes: this.bookingForm.value.notes || '',
    };
  
    this.bookingService.createBooking(bookingData).subscribe({
      next: () => {
        alert('Đặt tour thành công!');
        this.bookingForm.reset();
        this.totalPrice = 0;
        this.router.navigate(['/tour', this.tourId]).then(() => {
          alert('Bạn đã đặt tour thành công!');
        });
      },
      error: () => alert('Đặt tour thất bại. Vui lòng thử lại.'),
    });
  }

  calculateTotalPrice(amount: number): number {
    return amount > 0 && this.tour.price ? amount * this.tour.price : 0;
  }

  openImage(image: string): void {
    this.selectedImage = image;
  }

  closeModal(): void {
    this.selectedImage = null;
  }

  changeImage(direction: number): void {
    this.currentIndex = (this.currentIndex + direction + this.images.length) % this.images.length;
  }

  ngOnDestroy(): void {
    this.images.forEach((url) => URL.revokeObjectURL(url));
  }

  increase(group: any) {
    group.count++;
    this.updateTotal();
  }
  
  decrease(group: any) {
    if (group.count > 0) {
      group.count--;
      this.updateTotal();
    }
  }
  
 updateTotal() {
  this.ageGroups.forEach(group => {
    group.price = this.getPriceForAgeGroup(group.priceRate); // cập nhật lại giá nếu base price thay đổi
  });
  this.totalPrice = this.ageGroups.reduce((sum, g) => sum + g.price * g.count, 0);
}


yeuCauDat(): void {
  if (!this.selectedScheduleId || !this.tour) {
    alert('Vui lòng chọn lịch trình trước khi đặt tour.');
    return;
  }

  const selectedSchedule = this.tourSchedule.find(s => s.id === this.selectedScheduleId);
  
  const dataToSend = {
    tourDuration: this.tour.duration,
    tourDepatureLocation: this.tour.departureLocation,
    tourId: this.tour.id,
    tourName: this.tour.name,
    tourCode: this.tour.code,
    ageGroups: this.ageGroups,
    scheduleId: this.selectedScheduleId,
    scheduleStartDate: selectedSchedule?.startDate,
    scheduleEndDate: selectedSchedule?.endDate,
    totalPrice: this.totalPrice,
    price: this.tour.price,
    amount: this.bookingForm.value.amount,
  };

  this.router.navigate(['/yeu-cau-dat', this.tour.id], { state: dataToSend });
}


showFullSchedule = false;
selectedMonth = '6/2025';
availableMonths = ['6/2025', '7/2025']; // Tuỳ vào dữ liệu backend
calendarDays: { day: number, price?: number }[] = [];

selectDate(date: string) {
  this.selectedDate = date;
  const selectedSchedule = this.tourSchedule.find(s => s.startDate === date);
  this.selectedScheduleId = selectedSchedule ? selectedSchedule.id : null;
  if (date === 'all') {
    this.showFullSchedule = true;
    this.loadCalendarForMonth(this.selectedMonth);
  }
}

closeSchedulePopup() {
  this.showFullSchedule = false;
}

selectMonth(month: string) {
  this.selectedMonth = month;
  this.loadCalendarForMonth(month);
}

prevMonth() {
  // Xử lý chuyển về tháng trước
}

nextMonth() {
  // Xử lý chuyển sang tháng sau
}

loadCalendarForMonth(month: string) {
  // Demo cứng: tháng 6 có giá vào ngày 7
  if (month === '6/2025') {
    this.calendarDays = Array.from({ length: 30 }, (_, i) => ({
      day: i + 1,
      price: i + 1 === 7 ? 96990 : undefined,
    }));
  } else {
    this.calendarDays = Array.from({ length: 30 }, (_, i) => ({
      day: i + 1,
    }));
  }
}

isToday(date: { day: number }) {
  const today = new Date();
  return today.getDate() === date.day && today.getMonth() + 1 === parseInt(this.selectedMonth.split('/')[0]);
}

selectScheduleDate(date: { day: number, price?: number }) {
  this.selectedDate = `${date.day}/${this.selectedMonth.split('/')[0]}`;
  this.showFullSchedule = false;
}

}
