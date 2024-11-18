import { Component,OnInit,ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TourService } from '../service/tours.service';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { QuillEditorComponent } from 'ngx-quill';
@Component({
  selector: 'app-sua-thong-tin-tour',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule,QuillModule],
  templateUrl: './sua-thong-tin-tour.component.html',
  styleUrl: './sua-thong-tin-tour.component.scss'
})
export class SuaThongTinTourComponent implements OnInit{
  // newTour: any = {
  //   id: null,  // Mã tour (nếu có)
  //   content: '', // Nội dung tour
  //   image_header: ''  // Đường dẫn ảnh đại diện
  // };

  tour: any = {}; // Chứa thông tin tour
  tourImages: any[] = []; // Chứa danh sách ảnh
  successMessage: string = '';
  errorMessage: string = '';
  selectedImage: File | null = null;  // Ảnh người dùng chọn
  imagePreview: string | null = null; 
  constructor(
    private tourService: TourService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const tourId = this.route.snapshot.params['id']; // Đảm bảo bạn lấy đúng tham số 'id'
    this.loadTourImages(tourId);
    if (tourId) {
      this.fetchTourDetails(tourId);
    } else {
      this.errorMessage = 'Không tìm thấy thông tin tour cần sửa.';
    }
  }
  

  fetchTourDetails(tourId: number) {
    this.tourService.getDetailTour(tourId).subscribe({
      next: (data) => {
        this.tour = data;
      },
      error: (err) => {
        this.errorMessage = 'Không thể tải thông tin tour.';
      },
    });
  }

  // fetchTourImages(tourId: number) {
  //   this.tourService.getImagesByTourId(tourId).subscribe({
  //     next: (images) => {
  //       this.tourImages = images;
  //     },
  //     error: (err) => {
  //       this.errorMessage = 'Không thể tải danh sách ảnh.';
  //     },
  //   });
  // }

  onUpdateTour() {
    const tourId = this.tour.id;
  
    this.tourService.updateTour(tourId, this.tour).subscribe({
      next: (updatedTour) => {
        this.successMessage = 'Cập nhật tour thành công.';
        // Cập nhật dữ liệu tour sau khi chỉnh sửa
        this.tour = updatedTour;
      },
      error: (err) => {
        this.errorMessage = err.error || 'Cập nhật tour thất bại.';
      },
    });
  }
  



 // Xử lý sự kiện khi người dùng chọn ảnh mới
 onFileSelected(event: any) {
  const file = event.target.files[0];
  if (file) {
    this.selectedImage = file;

    // Tạo URL tạm thời để hiển thị ảnh đã chọn
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.imagePreview = e.target.result;
    };
    reader.readAsDataURL(file);
  }
}


  // Cập nhật ảnh đại diện mới (thay thế ảnh cũ)
  updateImage() {
    if (this.selectedImage) {
      // Cập nhật ảnh mới vào `newTour.image_header`
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.tour.image_header = e.target.result;
      };
      reader.readAsDataURL(this.selectedImage);

      // Sau khi thay thế ảnh, có thể thêm logic gửi dữ liệu lên backend nếu cần
      console.log("Ảnh đại diện đã được thay thế:", this.tour.image_header);
    }
  }

  // Tải danh sách ảnh của tour
  loadTourImages(tourId: number): void {
    this.tourService.getTourImages(tourId).subscribe({
      next: (images) => {
        this.tourImages = images;
      },
      error: (err) => {
        console.error('Không thể tải ảnh:', err);
      }
    });
  }

    // Xoá ảnh riêng lẻ
    deleteImage(imageId: number): void {
      this.tourService.deleteTourImage(imageId).subscribe({
        next: () => {
          this.successMessage = 'Xoá ảnh thành công!';
          this.tourImages = this.tourImages.filter((img) => img.id !== imageId);
        },
        error: (err) => {
          this.errorMessage = 'Không thể xoá ảnh.';
          console.error(err);
        }
      });
    }
  
    // Xoá tất cả ảnh
    deleteAllImages(): void {
      const tourId = this.tour.id;
      this.tourService.deleteAllTourImages(tourId).subscribe({
        next: () => {
          this.successMessage = 'Xoá tất cả ảnh thành công!';
          this.tourImages = [];
        },
        error: (err) => {
          this.errorMessage = 'Không thể xoá tất cả ảnh.';
          console.error(err);
        }
      });
    }
}
