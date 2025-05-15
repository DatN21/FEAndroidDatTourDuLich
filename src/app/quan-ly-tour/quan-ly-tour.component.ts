import { Component, OnInit, ViewChild } from '@angular/core';
import { TourService } from '../service/tours.service';
import { Tour } from '../model/tour';
import { CommonModule } from '@angular/common';
import { FormsModule ,NgForm} from '@angular/forms';
import { Router } from '@angular/router';
import { enviroment } from '../enviroments/enviroments';
import { RouterModule } from '@angular/router';
import { TourCreateDTO } from '../dtos/user/tourDTO/tour-create.dto';  // Import DTO nếu chưa làm
import { QuillModule } from 'ngx-quill';
import { TourResponse } from '../response/TourResponse';
import { TourScheduleResponse } from '../response/TourScheduleResponse';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'app-quan-ly-tour',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule,QuillModule],
  templateUrl: './quan-ly-tour.component.html',
  styleUrls: ['./quan-ly-tour.component.scss']
})
export class QuanLyTourComponent implements OnInit {
  selectedStartDate: string | null = null;  
  hasBooking: boolean = false; // Biến để lưu trạng thái checkbox "Tour có khách đặt"
  noBooking: boolean = false; // Biến để lưu trạng thái checkbox "Tour chưa có khách đặt"
  
  selectedStatus: string = ''; 
  fadeOut = false;
  errorMessage: string | null = null;
  newStatus: string = '';
  currentTour: any = null;
  filteredTours: TourResponse[] = [];
  tours: TourResponse[] = [];
  currentPage: number = 0;
  itemsPerPage: number = 12;
  totalPages: number = 0;
  visiblePages: number[] = [];
  keyword: string = "";
  showForm = false;
  successMessage: string = '';
  showAddImageForm: boolean = false; // Điều khiển hiển thị form thêm ảnh
  selectedFiles: File[] = [];        // Mảng lưu ảnh đã chọn
  selectedTourId: number | null = null;
  uploadedImageUrls: string[] = [];
  tourSchedule: TourScheduleResponse[] = [];
    tourSchedule2: TourScheduleResponse[] = [];
  // @ViewChild('themTour') registerForm!: NgForm;

  // newTour: TourCreateDTO = {
  //   tour_name: '',
  //   days: 0,
  //   start_date: new Date(),
  //   destination: '',
  //   tour_type: '',
  //   departure_location: '',
  //   status: '',
  //   // thumbnail: '',
  //   price: 0,
  //   description: '',
  //   content: '',
  // };


  constructor(private tourService: TourService, private router: Router) {}

  ngOnInit() {
    this.getTours(this.keyword, this.currentPage, this.itemsPerPage);
  }

// Mảng lưu lịch trình cho các tour
tourSchedules: TourScheduleResponse[] = [];

getTours(keyword: string, page: number, limit: number) {
    this.tourService.getToursFull(keyword, page, limit).subscribe({
      next: (response) => {
        if (response && response.data) {
          // Lấy danh sách các tour
          this.tours = response.data.content;
          this.totalPages = response.data.totalPages;
          this.filterTours(); // Sau khi lấy danh sách tour, gọi hàm lọc
          
          // Sau khi lấy danh sách tour, gọi hàm lấy lịch trình cho mỗi tour
          this.tours.forEach(tour => {
            this.getTourSchedule(tour.id);  // Gọi getTourSchedule để lấy lịch trình cho từng tour
          });
        } else {
          console.error('Lỗi khi tải tour:', response.message);
        }
      },
      error: (error) => {
        console.error('Lỗi kết nối:', error);
      }
    });
  }

private getTourSchedule(id: number): void {
  this.tourService.getAllTourSchedule(id).subscribe({
    next: (tourSchedule: TourScheduleResponse[]) => {
      if (tourSchedule && tourSchedule.length > 0) {
        // Tìm tour tương ứng trong danh sách tour
        const tour = this.tours.find(t => t.id === id);
        if (tour) {
          // Gán lịch trình vào tour
          tour.schedules = tourSchedule;
        }
      }
    },
    error: (error) => {
      console.error('Lỗi khi lấy lịch trình tour:', error);
      this.errorMessage = 'Không thể tải lịch trình tour.';
    }
  });
}

private getTourSchedule2(id: number): void {
  this.tourService.getAllTourSchedule(id).subscribe({
    next: (tourSchedule: TourScheduleResponse[]) => {
      if (tourSchedule && tourSchedule.length > 0) {
        // Tìm tour tương ứng và gán lịch trình vào tour
        const tour = this.tours.find(t => t.id === id);
        if (tour) {
          tour.schedules = tourSchedule;  // Gán lịch trình vào tour
        }
      }
    },
    error: (error) => {
      console.error('Lỗi khi lịch trình tour:', error);
      this.errorMessage = 'Không thể tải lịch trình tour.';
    }
  });
}

// Hàm để lấy lịch trình cho tour dựa vào tourId
private getTourScheduleByTourId(tourId: number): TourScheduleResponse[] {
  return this.tourSchedules.filter(schedule => +schedule.tourId === tourId);
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
    this.getTours(this.keyword, this.currentPage, this.itemsPerPage);
  }

  // onAddTourSubmit() {
  //   this.tourService.addTour(this.newTour).subscribe({
  //     next: () => {
  //       this.showForm = false;
  //       this.getTours(this.keyword, this.currentPage, this.itemsPerPage); // Tải lại danh sách tour
  //     },
  //     error: (error) => {
  //       console.error('Lỗi khi thêm tour:', error);
  //     }
  //   });
  // }


  

  // Hàm để chọn tourId khi người dùng chọn một tour cụ thể
  selectTour(tourId: number): void {
    this.selectedTourId = tourId;
  }

  cancelAddImage() {
    this.showAddImageForm = false;  // Ẩn form
    this.selectedFiles = [];  // Xóa danh sách tệp đã chọn
 
  }


  toggleAddImageForm() {
    this.showAddImageForm = !this.showAddImageForm;
  }

  deleteTour(tourId: number): void {
    // Hiển thị thông báo xác nhận trước khi xóa
    const confirmDelete = window.confirm('Bạn có chắc chắn muốn xóa tour này không?');
  
    if (confirmDelete) {
      // Kiểm tra xem tourId có hợp lệ hay không
      if (tourId) {
        // Gọi service để xóa tour
        this.tourService.deleteTour(tourId).subscribe({
          next: () => {
            // Hiển thị thông báo thành công
            this.successMessage = 'Tour đã được xóa thành công!';
            this.errorMessage = '';
            // Tải lại danh sách các tour
            this.getTours(this.keyword, this.currentPage, this.itemsPerPage);
          },
          error: (err) => {
            // Hiển thị thông báo lỗi khi xóa không thành công
            this.errorMessage = 'Đã xảy ra lỗi khi xóa tour.';
            console.error('Error deleting tour:', err);
          }
        });
      }
    }
  }
  
  // Hàm tìm kiếm tour mới
searchTours(keyword: string, page: number, limit: number) {
  // Chuyển đổi từ khóa về chữ thường để tìm kiếm không phân biệt hoa thường
  const lowerKeyword = keyword.trim().toLowerCase();

  // Gọi API tìm kiếm
  this.tourService.searchTours(keyword, page, limit).subscribe({
    next: (response: any) => {
      if (response && response.tourResponses) {
        console.log('Kết quả tìm kiếm 3: ', response.tourResponses);
        // Lọc các tour có chứa chuỗi keyword trong các trường thông tin
        this.tours = response.tourResponses.filter((tour: Tour) => {
          return (
            tour.tour_name.toLowerCase().includes(lowerKeyword) || 
            tour.destination.toLowerCase().includes(lowerKeyword) || 
            tour.description.toLowerCase().includes(lowerKeyword)
          );
        });

        // Cập nhật số trang và các trang hiển thị
        this.totalPages = response.totalPages;
        this.visiblePages = this.generateVisiblePageArray(this.currentPage, this.totalPages);
      } else {
        console.error("Cấu trúc phản hồi từ backend không đúng:", response);
      }
    },
    error: (error: any) => {
      console.error('Lỗi khi tìm kiếm tour:', error);
    }
  });
}

  

openStatusModal(tour: any): void {
    this.currentTour = tour;
    this.newStatus = tour.status; // Giữ trạng thái hiện tại để dễ dàng thay đổi
    const modalElement = document.getElementById('statusModal');
    if (modalElement) {
      modalElement.style.display = 'flex'; // Hiển thị modal
    }
  }

  // Đóng modal
  closeModal(): void {
    const modalElement = document.getElementById('statusModal');
    if (modalElement) {
      modalElement.style.display = 'none'; // Ẩn modal
    }
  }

  // Thay đổi trạng thái tour
showError(message: string) {
    this.errorMessage = message;  // Hiển thị thông báo lỗi
    this.fadeOut = false;  // Đảm bảo rằng class fade-out chưa được thêm vào

    // Sau 1.5 giây, thêm class fade-out và ẩn thông báo lỗi
    setTimeout(() => {
      this.fadeOut = true;

      // Sau 2 giây (đủ thời gian cho animation), ẩn thông báo lỗi
      setTimeout(() => {
        this.errorMessage = null;  // Ẩn thông báo
      }, 1000);  // Thời gian này tương ứng với hiệu ứng CSS
    }, 1000);  // Thời gian hiển thị là 1.5 giây
  }

  // Hàm xử lý khi thay đổi trạng thái tour
  changeStatus(): void {
    if (this.currentTour && this.newStatus) {
      // Giữ trạng thái cũ trong giao diện trước khi thay đổi
      const previousStatus = this.currentTour.status;

      // Cập nhật trạng thái trong giao diện ngay lập tức
      this.currentTour.status = this.newStatus;

      // Gọi API cập nhật trạng thái tour
      this.tourService.updateTourStatus(this.currentTour.id, this.newStatus).subscribe({
        next: (response) => {
          console.log('Cập nhật trạng thái tour thành công');
          this.closeModal(); // Đóng modal sau khi thay đổi
        },
        error: (error: HttpErrorResponse) => {
          // Nếu có lỗi, khôi phục lại trạng thái cũ và hiển thị thông báo lỗi từ backend
          console.error('Lỗi khi cập nhật trạng thái tour:', error);

          // Kiểm tra xem backend có gửi thông báo lỗi trong trường 'error' không
          if (error) {
            this.showError(error.error.error);  // Lấy thông báo lỗi từ backend
          } else {
            this.showError('Đã xảy ra lỗi khi cập nhật trạng thái tour.');
          }

          // Khôi phục lại trạng thái cũ
          this.currentTour.status = previousStatus; 
        }
      });
    }}
filterTours() {
  let filteredTours = this.tours;

  // Lọc theo trạng thái tour
  if (this.selectedStatus) {
    filteredTours = filteredTours.filter(tour => tour.status === this.selectedStatus);
  }

  // Lọc theo từ khóa tìm kiếm
  if (this.keyword) {
    filteredTours = filteredTours.filter(tour => {
      return (
        tour.name.toLowerCase().includes(this.keyword.toLowerCase()) || 
        tour.departureLocation.toLowerCase().includes(this.keyword.toLowerCase())
      );
    });
  }

  // Lọc theo ngày khởi hành
  if (this.selectedStartDate) {
    const selectedDate = new Date(this.selectedStartDate);
    filteredTours = filteredTours.filter(tour => {
      // Kiểm tra ngày khởi hành của lịch trình tour
      return tour.schedules?.some(schedule => {
        const startDate = new Date(schedule.startDate);
        return startDate.toDateString() === selectedDate.toDateString();
      });
    });
  }

  // Lọc theo trạng thái khách đặt (có khách đặt)
  if (this.hasBooking) {
    filteredTours = filteredTours.filter(tour => {
      return tour.schedules?.some(schedule => +schedule.bookedSlots > 0);  // Kiểm tra nếu có lịch trình nào có khách đặt
    });
  }

  // Lọc theo trạng thái khách đặt (chưa có khách đặt)
  if (this.noBooking) {
    filteredTours = filteredTours.filter(tour => {
      return tour.schedules?.every(schedule => +schedule.bookedSlots === 0);  // Kiểm tra nếu tất cả lịch trình đều chưa có khách đặt
    });
  }

  // Cập nhật danh sách tour đã lọc
  this.filteredTours = filteredTours;
}

}
