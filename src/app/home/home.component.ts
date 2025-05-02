import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { FooterComponent } from "../footer/footer.component";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { TourService } from '../service/tours.service';
import { Tour } from '../model/tour';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [HeaderComponent, FooterComponent, FormsModule, CommonModule, RouterModule],
})
export class HomeComponent implements OnInit {
  tours: Tour[] = [];
  filteredTours: Tour[] = [];
  currentPage: number = 0;
  itemsPerPage: number = 12;
  totalPages: number = 0;
  visiblePages: number[] = [];
  keyword: string = "";
  selectedBudget: string = 'all';
  selectedSortOption: string = 'all';
  selectedDepartureDate: string = '';
  constructor(
    private tourService: TourService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getTours(this.keyword, this.currentPage, this.itemsPerPage);
  }

  getTours(keyword: string, page: number, limit: number) {
    this.tourService.getTours(keyword, page, limit).subscribe({
      next: (response: any) => {
        if (response && response.tourResponses) {
          this.tours = response.tourResponses;
          this.applyFilters(); // cập nhật filteredTours theo filters
          this.totalPages = response.totalPages;
          this.visiblePages = this.generateVisiblePageArray(this.currentPage, this.totalPages);
        } else {
          console.error("Cấu trúc phản hồi không đúng:", response);
        }
      },
      error: (error: any) => {
        console.error('Lỗi khi lấy dữ liệu tour:', error);
      }
    });
  }

  searchTours(): void {
    if (this.keyword.trim()) {
      this.router.navigate(['/tour-tim-kiem'], { queryParams: { keyword: this.keyword } });
    }
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.getTours(this.keyword, this.currentPage, this.itemsPerPage);
  }

  generateVisiblePageArray(currentPage: number, totalPages: number): number[] {
    const maxVisiblePages = 5;
    const halfVisiblePages = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(currentPage - halfVisiblePages, 1);
    let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(endPage - maxVisiblePages + 1, 1);
    }

    return new Array(endPage - startPage + 1).fill(0).map((_, index) => startPage + index);
  }

  goToTourDetail(tourId: string): void {
    this.router.navigate(['/tour-detail', tourId]);
  }

  updateFilter(filterType: string, value: string) {
    if (filterType === 'budget') {
      this.selectedBudget = this.selectedBudget === value ? 'all' : value; // toggle on/off
    }
  }
  getDayOfWeek(date: string): string {
    const daysOfWeek = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
    const dayIndex = new Date(date).getDay();
    return daysOfWeek[dayIndex];
  }
  
  applyFilters() {
    let result = [...this.tours];

    // Lọc theo ngân sách
    result = result.filter(tour => {
      const price = Number(tour.price);
      switch (this.selectedBudget) {
        case 'under5':
          return price < 5000000;
        case '5to10':
          return price >= 5000000 && price <= 10000000;
        case '10to20':
          return price > 10000000 && price <= 20000000;
        case 'above20':
          return price > 20000000;
        default:
          return true;
      }
    });

    // Sắp xếp
    switch (this.selectedSortOption) {
      case 'nearest':
        result.sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime());
        break;
      case 'priceLowToHigh':
        result.sort((a, b) => Number(a.price) - Number(b.price));
        break;
      case 'priceHighToLow':
        result.sort((a, b) => Number(b.price) - Number(a.price));
        break;
    }

    this.filteredTours = result;
  }

  onSortChange() {
    this.applyFilters();
  }
}
