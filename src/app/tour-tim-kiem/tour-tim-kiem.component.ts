import { Component, OnInit } from '@angular/core';
import { TourService } from '../service/tours.service';
import { Router } from '@angular/router';  // Import Router
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Tour } from '../model/tour';
@Component({
  selector: 'app-tour-tim-kiem',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tour-tim-kiem.component.html',
  styleUrls: ['./tour-tim-kiem.component.scss']
})
export class TourTimKiemComponent implements OnInit {
  keyword: string = '';  // Từ khóa tìm kiếm
  tours: any[] = [];  // Danh sách tour tìm kiếm
  totalPages: number = 0;  // Tổng số trang
  visiblePages: number[] = [];  
  noResults: boolean = false; // Biến kiểm tra có kết quả hay không

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private tourService: TourService) { }

  ngOnInit(): void {
    // Lấy từ khóa tìm kiếm từ queryParams
    this.activatedRoute.queryParams.subscribe(params => {
      this.keyword = params['keyword'] || '';  // Lấy giá trị từ 'keyword' trong URL
      if (this.keyword) {
        this.searchTours(this.keyword, 0, 10);  // Gọi hàm tìm kiếm với từ khóa
      }
    });
  }

  // Hàm tìm kiếm tour
  searchTours(keyword: string, page: number, limit: number): void {
    const lowerKeyword = keyword.trim().toLowerCase();

    this.tourService.searchTours(keyword, page, limit).subscribe({
      next: (response: any) => {
        if (response && response.tourResponses) {
          console.log('Cả phản hồi từ backend:', response.tourResponses);  // In ra toàn bộ phản hồi
          // Kiểm tra nếu có tour phù hợp với từ khóa tìm kiếm
          this.tours = response.tourResponses.filter((tour: Tour) =>
            tour.tour_name.toLowerCase().includes(lowerKeyword) ||
            tour.destination.toLowerCase().includes(lowerKeyword) ||
            tour.description.toLowerCase().includes(lowerKeyword)
          );

          // Nếu không có kết quả tìm kiếm
          if (this.tours.length === 0) {
            this.noResults = true;
          } else {
            this.noResults = false;
          }

          // Cập nhật số trang và các trang hiển thị
          this.totalPages = response.totalPages;
          this.visiblePages = this.generateVisiblePageArray(page, this.totalPages);
        } else {
          console.error("Cấu trúc phản hồi từ backend không đúng:", response);
          this.noResults = true; // Nếu có lỗi trong phản hồi từ backend
        }
      },
      error: (error) => {
        console.error('Lỗi khi tìm kiếm tour:', error);
        this.noResults = true; // Nếu có lỗi xảy ra trong quá trình tìm kiếm
      }
    });
  }

  // Hàm tạo mảng các trang hiển thị
  generateVisiblePageArray(currentPage: number, totalPages: number): number[] {
    const pages: number[] = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }
  goToTourDetail(tourId: string): void {
    this.router.navigate(['/tour-detail', tourId]); // Điều hướng đến trang chi tiết tour
  }
}
