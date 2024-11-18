import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TourService } from '../service/tours.service'; // Đảm bảo import TourService
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-them-anh',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './them-anh.component.html',
  styleUrls: ['./them-anh.component.scss']
})
export class ThemAnhComponent implements OnInit {
  tourId: number | null = null;
  selectedFiles: File[] = [];
  uploadedImageUrls: string[] = [];
  showAddImageForm = true;
  successMessage: string = '';  // Biến lưu thông báo thành công
  errorMessage: string = '';  
  constructor(private route: ActivatedRoute, private tourService: TourService) {}

  ngOnInit(): void {
    // Lấy tourId từ URL
    this.route.paramMap.subscribe(params => {
      this.tourId = +params.get('id')!;  // Chuyển 'id' thành kiểu number
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.selectedFiles = Array.from(input.files);
      if (this.selectedFiles.length > 5) {
        alert('Chỉ được chọn tối đa 5 ảnh');
        this.selectedFiles = this.selectedFiles.slice(0, 5); // Giới hạn số lượng ảnh
      }
    }
  }

  // Hàm upload ảnh
  uploadImages(): void {
    if (this.tourId !== null && this.selectedFiles.length > 0) {
      this.tourService.uploadImages(this.tourId, this.selectedFiles).subscribe({
        next: (response) => {
          console.log('Uploaded images:', response);
          this.uploadedImageUrls = response.map((image: any) => image.imageUrl); // Giả sử backend trả về imageUrl
          this.successMessage = 'Thêm ảnh thành công!'; // Hiển thị thông báo thành công
          this.errorMessage = ''; // Reset thông báo lỗi nếu có
          this.selectedFiles = []; // Xóa danh sách file đã chọn
        },
        error: (error) => {
          console.error('Error uploading images:', error);
          this.errorMessage = 'Lỗi khi thêm ảnh. Vui lòng thử lại.'; // Hiển thị thông báo lỗi nếu có
          this.successMessage = ''; // Reset thông báo thành công nếu có lỗi
        }
      });
    } else {
      this.errorMessage = 'Tour ID hoặc ảnh chưa được chọn!'; // Thông báo nếu thiếu dữ liệu
      this.successMessage = ''; // Reset thông báo thành công nếu thiếu dữ liệu
    }
  }

  close(): void {
    // Logic để đóng trang hoặc quay lại trang trước
    window.history.back();  // Quay lại trang trước
  }
}
