import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TourService } from '../service/tours.service'; // Đảm bảo import TourService
import { AdminService } from '../service/admin.service';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs'; // Import Subscription

@Component({
  selector: 'app-them-anh',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './them-anh.component.html',
  styleUrls: ['./them-anh.component.scss']
})
export class ThemAnhComponent implements OnInit, OnDestroy { // Thêm OnDestroy vào đây
  images: any[] = [];
  tourId: number | null = null;
  currentPage: number = 1;
  pageSize: number = 5;
  totalPages: number = 0;
  loading: boolean = false;
  selectedFiles: File[] = [];
  uploadedImageUrls: string[] = [];
  showAddImageForm = true;
  successMessage: string = '';
  errorMessage: string = '';
  pages: number[] = []; // Mảng chứa danh sách số trang
  private paramMapSubscription: Subscription = new Subscription(); // Khai báo biến để lưu subscription

  constructor(private route: ActivatedRoute, private tourService: TourService, private adminService: AdminService) {}

  ngOnInit(): void {
    this.paramMapSubscription = this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.tourId = +id;
        this.loadImages();
      } else {
        console.error('Tour ID không hợp lệ');
      }
    });
  }

  ngOnDestroy(): void {
    // Hủy bỏ subscription khi component bị hủy
    if (this.paramMapSubscription) {
      this.paramMapSubscription.unsubscribe();
    }
  }

  // Chọn ảnh từ input
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.selectedFiles = Array.from(input.files);
      if (this.selectedFiles.length > 5) {
        alert('Chỉ được chọn tối đa 5 ảnh');
        this.selectedFiles = this.selectedFiles.slice(0, 5);
      }
    }
  }

  // Upload ảnh
  uploadImages(): void {
    if (this.tourId !== null && this.selectedFiles.length > 0) {
      this.tourService.uploadImages(this.tourId, this.selectedFiles).subscribe({
        next: (response) => {
          console.log('Uploaded images:', response);
          this.uploadedImageUrls = response.map((image: any) => image.imageUrl);
          this.successMessage = 'Thêm ảnh thành công!';
          this.errorMessage = '';
          this.selectedFiles = [];
        },
        error: (error: HttpErrorResponse) => {
          if (error.error && error.error.error) {
            this.errorMessage = error.error.error;
          } else {
            this.errorMessage = 'Đã xảy ra lỗi khi tải ảnh.';
          }
          console.error('Error uploading images:', error);
          this.successMessage = '';
        }
      });
    } else {
      this.errorMessage = 'Ảnh chưa được chọn!';
      this.successMessage = '';
    }
  }

  // Đóng trang
  close(): void {
    window.history.back();
  }

  private loadImages(): void {
    if (!this.tourId) {
      console.error('Tour ID is null or undefined');
      return;
    }
  
    this.loading = true; // Hiển thị trạng thái đang tải
    this.adminService.getImagesByTourId(this.tourId, this.currentPage - 1, this.pageSize).subscribe({
      next: (response) => {
        if (!response.images || response.images.length === 0) {
          this.images = [];
          this.errorMessage = 'Không có ảnh nào được tìm thấy.';
          this.totalPages = 0;
          this.pages = [];
          return;
        }
  
        const imageRequests = response.images.map((img: { imgUrl: string }) =>
          this.adminService.getImageWithToken(img.imgUrl).toPromise()
        );
  
        Promise.all(imageRequests)
          .then((imageBlobs) => {
            this.images = response.images.map((img: { imgUrl: string }, index: number) => ({
              ...img,
              fullUrl: imageBlobs[index] ? URL.createObjectURL(imageBlobs[index]) : null,
            }));
            this.errorMessage = ''; // Xóa thông báo lỗi (nếu có)
          })
          .catch((err) => {
            console.error('Error loading images:', err);
            this.errorMessage = 'Có lỗi xảy ra khi tải ảnh.';
          })
          .finally(() => {
            this.loading = false;
          });
  
        this.totalPages = response.totalPages || 0; // Cập nhật số trang
        this.generatePageArray(); // Tạo lại danh sách các trang
      },
      error: (err) => {
        console.error('Error fetching image list:', err);
        this.errorMessage = 'Không thể tải danh sách ảnh.';
        this.loading = false;
      },
    });
  }
  
  
  
  

  // Xử lý thay đổi trang
  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadImages();
  }

  logAndReturn(url: string): string {
    console.log('Image URL:', url);
    return url;
  }

  // Xóa ảnh
  deleteImage(imageId: number): void {
    const confirmDelete = window.confirm('Bạn có chắc chắn muốn xóa ảnh này không?');
  
    if (confirmDelete) {
      if (this.tourId && imageId) {
        this.adminService.deleteImage(imageId).subscribe({
          next: () => {
            this.successMessage = 'Ảnh đã được xóa thành công!';
            this.errorMessage = '';
            this.loadImages();
          },
          error: (err) => {
            this.errorMessage = 'Đã xảy ra lỗi khi xóa ảnh.';
            console.error('Error deleting image:', err);
          }
        }); 
      }
    }
  }



// Tạo danh sách trang mỗi khi thay đổi số trang
private generatePageArray(): void {
  this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
}

}
