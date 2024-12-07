import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TourService } from '../service/tours.service';
import { QuillModule } from 'ngx-quill';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-sua-thong-tin-tour',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, QuillModule],
  templateUrl: './sua-thong-tin-tour.component.html',
  styleUrls: ['./sua-thong-tin-tour.component.scss']
})
export class SuaThongTinTourComponent implements OnInit {
  tour: any = {}; // Chứa thông tin tour
  successMessage: string = '';
  errorMessage: string = '';
  selectedImage: File | null = null; // Ảnh người dùng chọn
  imagePreview: string | null = null;

  constructor(
    private tourService: TourService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const tourId = this.route.snapshot.params['id']; // Đảm bảo bạn lấy đúng tham số 'id'
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

  onUpdateTour() {
    // Nếu có ảnh mới, cập nhật ảnh đại diện
    if (this.selectedImage) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.tour.imageHeader = e.target.result;
        this.submitTourUpdate();
      };
      reader.readAsDataURL(this.selectedImage);
    } else {
      this.submitTourUpdate();
    }
  }

  // Thực hiện gửi dữ liệu cập nhật tour
  submitTourUpdate() {
    const tourId = this.tour.id;
    this.tourService.updateTour(tourId, this.tour).subscribe({
      next: (updatedTour) => {
        this.successMessage = 'Cập nhật tour thành công.';
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

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }
  
}
