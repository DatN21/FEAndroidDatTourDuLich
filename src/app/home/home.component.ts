import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { FooterComponent } from "../footer/footer.component";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { TourService } from '../service/tours.service';
import { TourResponse } from '../response/TourResponse';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [FormsModule, CommonModule, RouterModule],
})
export class HomeComponent implements OnInit {
  tours: TourResponse[] = [];
  displayedTours: TourResponse[] = [];
  selectedDepartureDate: Date | null = null;
  currentPage: number = 1;
  itemsPerPage: number = 6;
  totalPages: number = 0;
  visiblePages: number[] = [];

  keyword: string = '';
  selectedBudget: string = 'all';
  selectedSortOption: string = 'all';
  constructor(private tourService: TourService, private router: Router) {}

  ngOnInit() {
    this.getTours(this.keyword);
  }

  getTours(keyword: string) {
    this.tourService.getToursByActive(keyword, 0, 1000).subscribe({
      next: (response) => {
        if (response && response.data) {
          this.tours = response.data.content;
          this.applyFilters();
        } else {
          console.error('Lỗi khi tải tour:', response.message);
        }
      },
      error: (error) => {
        console.error('Lỗi kết nối:', error);
      }
    });
  }

  searchTours(): void {
    this.currentPage = 1;
    this.getTours(this.keyword);
  }

  applyFilters() {
    let result = [...this.tours];

    // Lọc theo ngân sách
    result = result.filter(tour => {
      const price = Number(tour.price);
      switch (this.selectedBudget) {
        case 'under5': return price < 5000000;
        case '5to10': return price >= 5000000 && price <= 10000000;
        case '10to20': return price > 10000000 && price <= 20000000;
        case 'above20': return price > 20000000;
        default: return true;
      }
    });

   // Lọc theo ngày khởi hành
  if (this.selectedDepartureDate) {
    const selectedDateOnly = new Date(this.selectedDepartureDate);
    selectedDateOnly.setHours(0, 0, 0, 0); // loại bỏ giờ để so sánh chính xác ngày

    result = result.filter(tour => {
      if (!tour.startDate) return false;
      const tourStartDate = new Date(tour.startDate);
      tourStartDate.setHours(0, 0, 0, 0);
      return tourStartDate.getTime() === selectedDateOnly.getTime();
    });
  }


    // Sắp xếp
    switch (this.selectedSortOption) {
      case 'priceLowToHigh':
        result.sort((a, b) => Number(a.price) - Number(b.price));
        break;
      case 'priceHighToLow':
        result.sort((a, b) => Number(b.price) - Number(a.price));
        break;
      case 'nearest':
        result.sort((a, b) => {
          const dateA = new Date(a.startDate || '').getTime();
          const dateB = new Date(b.startDate || '').getTime();
          return dateA - dateB;
        });
        break;
    }

    this.totalPages = Math.ceil(result.length / this.itemsPerPage);
    this.updatePagination(result);
  }

  updatePagination(filteredList: TourResponse[]) {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.displayedTours = filteredList.slice(start, end);
    this.visiblePages = this.generateVisiblePageArray(this.currentPage, this.totalPages);
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.applyFilters();
  }

  generateVisiblePageArray(currentPage: number, totalPages: number): number[] {
    const maxPages = 5;
    const half = Math.floor(maxPages / 2);
    let start = Math.max(currentPage - half, 1);
    let end = Math.min(start + maxPages - 1, totalPages);

    if (end - start + 1 < maxPages) {
      start = Math.max(end - maxPages + 1, 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }

  updateFilter(filterType: string, value: string) {
    if (filterType === 'budget') {
      this.selectedBudget = this.selectedBudget === value ? 'all' : value;
    }
    this.currentPage = 1;
    this.applyFilters();
  }

  goToTourDetail(tourId: string): void {
    this.router.navigate(['/tour-detail', tourId]);
  }

  
// Ví dụ: Hàm được gọi sau khi load data từ API
loadTourDetails(tour: TourResponse): void {
  this.selectedDepartureDate = tour.startDate ? new Date(tour.startDate) : null;
}

// Đổi ngày khởi hành
onDepartureDateChange(event: string): void {
  this.selectedDepartureDate = new Date(event);
}

// Lấy thứ trong tuần
getDayOfWeek(date: Date): string {
  const days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
  return days[date.getDay()];
}

getTourDurationText(duration: number): string {
  if (duration === 1) {
    return '1 ngày';
  } 
   else {
    return `${duration} ngày ${duration - 1} đêm`;
  }
}
// sortTours() {
//     switch (this.selectedSortOption) {
//       case 'nearest':
//         this.tours.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
//         break;
//       case 'priceLowToHigh':
//         this.tours.sort((a, b) => a.price - b.price);
//         break;
//       case 'priceHighToLow':
//         this.tours.sort((a, b) => b.price - a.price);
//         break;
//       case 'all':
//       default:
//         this.getTours(this.keyword); // Gọi lại API hoặc khôi phục thứ tự gốc
//         break;
//     }
//   }
}
