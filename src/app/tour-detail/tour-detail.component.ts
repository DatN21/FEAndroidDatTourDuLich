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

@Component({
  selector: 'app-tour-detail',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, FormsModule, CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './tour-detail.component.html',
  styleUrls: ['./tour-detail.component.scss'],
})
export class TourDetailComponent implements OnInit, OnDestroy {
  bookingForm!: FormGroup;
  tour: any = {}; 
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
    this.initializeForm();
    this.loadTourData();
  }

  private initializeForm(): void {
    this.bookingForm = this.fb.group({
      amount: [1, [Validators.required, Validators.min(1)]],
      start_date: ['', Validators.required],
      phoneNumber: [
        '',
        [Validators.required, Validators.pattern(/^(0[3|5|7|8|9])+([0-9]{8})$/)],
      ],
      notes: [''],
      fullName: ['', [Validators.required, Validators.minLength(3)]],
    });

    this.bookingForm.get('amount')?.valueChanges.subscribe((amount) => {
      this.totalPrice = this.calculateTotalPrice(amount);
    });
  }

  private loadTourData(): void {
    const tourId = Number(this.route.snapshot.params['id']);
    if (tourId) {
      this.tourId = tourId;
      this.fetchTourDetails(tourId);
      this.loadImages();
    } else {
      this.errorMessage = 'Không tìm thấy thông tin tour.';
    }
  }

  private fetchTourDetails(tourId: number): void {
    this.tourService.getDetailTour(tourId).subscribe({
      next: (data) => {
        this.tour = data;
        this.pricePerPerson = (data as any).price;
        this.totalPrice = this.calculateTotalPrice(this.bookingForm.value.amount);
      },
      error: () => {
        this.errorMessage = 'Không thể tải thông tin tour.';
      },
    });
  }

  private loadImages(): void {
    this.loading = true;
    this.imageService.getImagesByTourIdArray(this.tourId).subscribe({
      next: (data) => {
        const imageRequests = data.map((img) =>
          this.imageService.getImageWithToken(img.imgUrl).toPromise()
        );

        Promise.all(imageRequests)
        .then((imageBlobs) => {
          this.images = imageBlobs
            .filter((blob): blob is Blob => !!blob && blob.size > 0) // Sử dụng '!!blob' để loại bỏ 'undefined'
            .map((blob) => URL.createObjectURL(blob));
        })
        .catch((err) => {
          console.error('Lỗi khi tải ảnh:', err);
        })
        .finally(() => {
          this.loading = false;
        });
      },
      error: () => (this.loading = false),
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
      tour_name: this.tour.tourName,
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
}
