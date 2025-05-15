
import { FormBuilder, FormGroup, ReactiveFormsModule,Validators  } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TourByAgeResponse } from '../response/TourByAgeResponse';
import { TourService } from '../service/tours.service';
import { BookingService } from '../service/booking.service';
import { AuthService } from '../service/auth.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Passenger } from '../response/Passenger';
import { BookingDetailDTOInput } from '../dtos/BookingDetailDTOInput';
@Component({
  selector: 'app-yeu-cau-dat',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './yeu-cau-dat.component.html',
  styleUrls: ['./yeu-cau-dat.component.scss']  // Sử dụng styleUrls thay vì styleUrl
})
export class YeuCauDatComponent implements OnInit {
   showPaymentForm: boolean = false;
  // Đây là nơi bạn có thể thêm logic cho component nếu cần
tourAgeGroups: TourByAgeResponse[] = [];
    selectedBasePrice: number = 0;
    nguoiLon: number = 0;
    treEm2tuoi: number = 0;
    treEm210tuoi: number = 0;
    errorMessage: string = ''; 
    user: any;
    totalAmount: number = 0;
    contactForm: FormGroup;
    message: string = '';
 passengerDetails: Passenger[] = [];
 bookingData!: BookingDetailDTOInput;
  summaryList: { label: string; count: number; price: number; total: number }[] = [];
 ageGroups: { header:string, key:string,  describe: string; priceRate: number; price: number; count: number }[] = [];
 bookingDetail: {  fullName:string, gender:string, pricePerSon:string, birthDate:string}[] = [];
// Định nghĩa cấu trúc của passengers
passengers: { [key: string]: { fullName: string, gender: string, dob: string , pricePerPerson:number}[] } = {
  adult: [],        // Danh sách hành khách người lớn
  child: [],        // Danh sách hành khách trẻ em
  newbornBaby: [],  // Danh sách hành khách sơ sinh
};

 paymentMethods = [
    { name: 'PayPal', imageUrl: '/assets/image/4375034_logo_paypal_icon.png', description: 'Thanh toán PayPal' },
    { name: 'OnePay', imageUrl: '/assets/image/nganHang.png', description: 'Thanh toán qua số tài khoản' },
    { name: 'VNPay', imageUrl: '/assets/image/images.png', description: 'Thanh toán VNPay' },
    { name: 'Momo', imageUrl: '/assets/image/square-8c08a00f550e40a2efafea4a005b1232.png', description: 'Thanh toán qua MoMo' }
  ];
  selectedPaymentMethod: string = '';
stateData: any;

constructor(
  private fb: FormBuilder,
  private tourService: TourService,
  private bookingService: BookingService,
  private authService: AuthService,
  private router: Router
) {
  this.contactForm = this.fb.group({
    name: ['', Validators.required], // Họ tên là bắt buộc
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10,11}$')]], // Kiểm tra số điện thoại đúng định dạng
      email: ['', [Validators.email]], // Kiểm tra email hợp lệ
      address: ['']
  });

  const navigation = this.router.getCurrentNavigation();
  const state = navigation?.extras?.state;

  if (state) {
    this.stateData = state;
  }
}


   ngOnInit(): void {
    this.user = this.authService.getLoggedInUser();
    this.getTourAgeGroup(); // Gọi tất cả từ đây
    this.updateSummary();
  }
updateSummary() {
  this.summaryList = this.stateData.ageGroups.map((group: TourByAgeResponse) => ({
    label: group.describe,
    price: (group.priceRate) * this.stateData['price'],
    key: group.key,
  }));
}

getPriceForAgeGroup(rate: number): number {
  if (rate === 0) {
    return this.selectedBasePrice;
  }
  return this.selectedBasePrice - (this.selectedBasePrice * rate);
}
private getTourAgeGroup(): void {
  this.tourService.getAllTourByAge().subscribe({
    next: (ageGroups: TourByAgeResponse[]) => {
      this.tourAgeGroups = ageGroups;
      this.ageGroups = ageGroups.map(group => ({
        key: group.key || '', // Ensure a key is provided
        describe: group.describe,
        priceRate: group.priceRate,
        header: group.header,
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

increase(groupKey: string) {
  const group = this.ageGroups.find(g => g.key === groupKey); // Tìm nhóm tuổi theo groupKey
  if (group) {
    group.count++; // Tăng số lượng hành khách

    // Tính pricePerPerson dựa trên công thức đã cho
    const pricePerPerson = (this.stateData['price'] - (group.priceRate * this.stateData['price']));

    // Thêm hành khách mới vào mảng của nhóm tuổi tương ứng
    this.passengers[groupKey].push({
      fullName: '', 
      gender: '', 
      dob: '', 
      pricePerPerson: pricePerPerson // Áp dụng giá tính từ công thức
    });

    this.calculateTotalAmount(); // Cập nhật tổng tiền
  }
}




decrease(groupKey: string) {
  const group = this.ageGroups.find(g => g.key === groupKey);
  if (group && group.count > 0) {
    group.count--;
    // Xóa hành khách cuối cùng của nhóm
    this.passengers[groupKey].pop();
    this.calculateTotalAmount();
  }
}

  // Hàm lấy danh sách hành khách từ các ô input trong form
getPassengerList(groupKey: string): any[] {
     return this.passengers[groupKey];
}


calculateTotalAmount() {
  let total = 0;
  this.summaryList = [];

  for (const group of this.ageGroups) {
    const original = this.tourAgeGroups.find(g => g.key === group.key);
    if (original && group.count > 0) {
      const groupTotal = (this.stateData['price'] - (original.priceRate * this.stateData['price'])) * group.count;
      total += groupTotal;

      this.summaryList.push({
        label: original.describe,
        count: group.count,
        price: (this.stateData['price'] - (original.priceRate * this.stateData['price'])),
        total: total
      });
    }
  }

  this.totalAmount = total;
}

placeOrder2() {
  // Khởi tạo mảng chứa thông tin hành khách
  const passengerDetails: { fullName: string, gender: string, birthDate: string, id: string, pricePerPerson: number }[] = [];

  // Duyệt qua từng nhóm tuổi trong ageGroups
  this.tourAgeGroups.forEach(group => {
    console.log('Group ID:', group.id); 
    // Lấy danh sách hành khách cho mỗi nhóm tuổi bằng cách gọi getPassengerList với group.key
    const groupPassengers = this.getPassengerList(group.key);
    groupPassengers.forEach(passenger => {
      passenger.ageGroupId = group.id;  // Gán ageGroupId từ group.id vào hành khách
    });
    // Kết hợp tất cả hành khách của nhóm này vào mảng passengerDetails
    passengerDetails.push(...groupPassengers);
  });
const totalBookedSlots = this.summaryList.reduce((total, slot) => total + slot.count, 0);
  // Dữ liệu gửi lên API
  const customerData = {
    customerId: this.user.id,
    message: this.message,
    fullName: this.contactForm.value.name,
    phone: this.contactForm.value.phone,
    email: this.contactForm.value.email,
    address: this.contactForm.value.address,
    tourScheduleId: this.stateData?.scheduleId,
    paymentMethod: this.selectedPaymentMethod,
    bookedSlots: totalBookedSlots,
    details: passengerDetails // Dữ liệu hành khách đã được gom từ các nhóm tuổi
  };

  // Lưu thông tin vào localStorage
  localStorage.setItem('customerData', JSON.stringify(customerData));

  // Gọi createBooking sau khi đã chuẩn bị dữ liệu
  this.createBooking(customerData);
}



  placeOrder() {
    this.showPaymentForm = true; // Hiển thị form thanh toán
  }
  onSubmit(): void {
    if (this.selectedPaymentMethod) {
      console.log(`Chọn phương thức thanh toán: ${this.selectedPaymentMethod}`);
      // Xử lý thanh toán tại đây (gửi yêu cầu tới backend)
    } else {
      alert('Vui lòng chọn phương thức thanh toán.');
    }
  }
selectPaymentMethod(method: string): void {
  // Nếu phương thức đã chọn, bỏ chọn nó, nếu không, chọn phương thức mới
  this.selectedPaymentMethod = (this.selectedPaymentMethod === method) ? '' : method;
}

  closePaymentForm(): void {
    this.showPaymentForm = false;  // Đóng form khi click vào dấu "X"
  } 

createBooking(customerData: any): void {
  this.bookingService.createBooking(customerData)
    .subscribe(
      (success: boolean) => {
        if (success) {
          console.log('Booking Created Successfully');
          alert('Booking created successfully!');
        } else {
          console.error('Error creating booking');
          alert('Booking creation failed!');
        }
      },
      (error) => {
        console.error('Error creating booking:', error);
        alert('An error occurred while creating the booking.');
      }
    );
}

}
