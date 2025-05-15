import { Component, OnInit, ViewChild } from '@angular/core';
import { TourService } from '../service/tours.service';
import { TourCreateDTO } from '../dtos/user/tourDTO/tour-create.dto';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { QuillModule } from 'ngx-quill';
import { QuillEditorComponent } from 'ngx-quill';

@Component({
  selector: 'app-them-tour',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, QuillModule],
  templateUrl: './them-moi-tour.component.html',
  styleUrls: ['./them-moi-tour.component.scss']
})
export class ThemMoiTourComponent implements OnInit {
  @ViewChild('themTour') registerForm!: NgForm;
  @ViewChild('quillEditor') quillEditor: QuillEditorComponent | undefined;
  newTour: TourCreateDTO = {
    tourName: '',
    duration: 1,
    description: '',
    departureLocation: '',
    status: '',
    price: 0,
    imageHeader: '',
  };

  selectedFiles: File[] = [];
  uploadedImageUrls: string[] = [];  // Mảng lưu trữ các URL ảnh đã upload
  selectedImageBase64: string | undefined = '';
  successMessage: string = ''; // Thông báo thành công
  errorMessage: string = ''; // Thông báo lỗi

  constructor(private tourService: TourService, private router: Router) {}

  ngOnInit(): void {}

  // Phương thức gửi tour mới
  createTour(): void {
    const editor = this.quillEditor?.quillEditor;
    if (editor) {
      let content = editor.root.innerHTML;
  
      // Thay thế các URL cũ trong nội dung của Quill Editor với các ảnh đã upload (nếu có)
      this.uploadedImageUrls.forEach((url, index) => {
        content = content.replace(`src="path/to/old/image${index}"`, `src="${url}"`);
      });
  
      // Gán ảnh đại diện nếu có (từ base64)
      if (this.selectedImageBase64) {
        this.newTour.imageHeader = this.selectedImageBase64;
      }
  
      const newTour: TourCreateDTO = {
        tourName: this.newTour.tourName,
        duration: this.newTour.duration,
        status: this.newTour.status,
        price: this.newTour.price,
        description: this.newTour.description,
        departureLocation: this.newTour.departureLocation,
        imageHeader: this.newTour.imageHeader, // Gán ảnh đại diện
      };
  
      // Gửi yêu cầu tạo tour
      this.tourService.addTour(newTour).subscribe({
        next: (tour) => {
          this.successMessage = 'Thêm mới tour thành công!'; // Hiển thị thông báo thành công
          this.errorMessage = ''; // Xóa thông báo lỗi (nếu có)
          this.registerForm.resetForm(); // Reset form
          this.router.navigate(['/quan-ly-tour']);
        },
        error: (err) => {
          console.error('Error creating tour:', err);
          this.errorMessage = 'Có lỗi xảy ra khi thêm tour. Vui lòng thử lại!'; // Hiển thị thông báo lỗi
          this.successMessage = ''; // Xóa thông báo thành công (nếu có)
        }
      });
    } else {
      console.error('Editor not initialized!');
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.newTour.imageHeader = e.target.result;  // Lưu URL base64 vào imageHeader
        console.log('Image Header Set:', this.newTour.imageHeader);  // Debug log
      };
      reader.readAsDataURL(file);  // Chuyển đổi ảnh thành URL base64
    } else {
      console.error('No file selected or invalid file input');
    }
  }
}
