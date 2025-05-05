import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-quan-ly-ctkm',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quan-ly-ctkm.component.html',
  styleUrls: ['./quan-ly-ctkm.component.scss']
})
export class QuanLyCtkmComponent {
  tours = [
    {
      id: 1,
      name: 'Tour Mũi Điện',
      scheduleDates: [
        new Date('2025-05-10'),
        new Date('2025-05-11'),
        new Date('2025-05-12'),
        new Date('2025-05-13'),
        new Date('2025-05-14'),
        new Date('2025-05-15'),
      ]
    },
    {
      id: 2,
      name: 'Tour Ghềnh Đá Đĩa',
      scheduleDates: [
        new Date('2025-06-01'),
        new Date('2025-06-02'),
        new Date('2025-06-03'),
        new Date('2025-06-04')
      ]
    },
    {
      id: 3,
      name: 'Tour Gành Đá Đĩa',
      scheduleDates: [
        new Date('2025-06-05'),
        new Date('2025-06-06'),
        new Date('2025-06-07'),
        new Date('2025-06-08')
      ]
    },
    {
      id: 4,
      name: 'Tour Hòn Khô',
      scheduleDates: [
        new Date('2025-07-01'),
        new Date('2025-07-02'),
        new Date('2025-07-03'),
        new Date('2025-07-04')
      ]
    },
    {
      id: 5,
      name: 'Tour Kỳ Co',
      scheduleDates: [
        new Date('2025-08-01'),
        new Date('2025-08-02'),
        new Date('2025-08-03'),
        new Date('2025-08-04')
      ]
    }
    ,
    {
      id: 6,
      name: 'Tháp nghinh phong',
      scheduleDates: [
        new Date('2025-08-01'),
        new Date('2025-08-02'),
        new Date('2025-08-03'),
        new Date('2025-08-04')
      ]
    }
  ];

  // Mảng tour sẽ hiển thị theo phân trang
  pagedTours: { id: number; name: string; scheduleDates: Date[] }[] = [];
  currentPage: number = 1;
  pageSize: number = 5;
  totalPages: number = 1;
  filteredTours: { id: number; name: string; scheduleDates: Date[] }[] = [];
  showCalendarPopup: boolean = false;
  showPromoForm: boolean = false;
  selectedTour: any;
  selectedDate: Date | null = null;
  searchQuery: string = '';
  promotions: { [key: string]: boolean } = {}; // { 'tourId_dateString': true }

  ngOnInit() {
    this.loadTours();
  }

  // Chức năng tải dữ liệu và tính toán phân trang
  loadTours() {
    this.totalPages = Math.ceil(this.tours.length / this.pageSize);
    this.changePage(1); // Hiển thị trang đầu tiên
  }

  // Hàm thay đổi trang
  changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    const start = (page - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.pagedTours = this.tours.slice(start, end); // Cập nhật mảng hiển thị theo trang
  }

  // Tạo ngày để giả lập lịch trình
  generateDates(days: number): Date[] {
    const dates = [];
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      dates.push(new Date(date));
    }
    return dates;
  }

  // Mở popup lịch
  openCalendarPopup(tour: any) {
    this.selectedTour = tour;
    this.showCalendarPopup = true;
  }

  // Đóng popup lịch
  closeCalendarPopup() {
    this.selectedTour = null;
    this.showCalendarPopup = false;
  }

  // Kiểm tra xem tour có khuyến mãi cho ngày này không
  hasPromotion(tourId: number, date: Date): boolean {
    return this.promotions[`${tourId}_${date.toDateString()}`] === true;
  }

  // Mở popup thêm khuyến mãi
  openPromotionPopup(tour: any, date: Date) {
    this.selectedTour = tour;
    this.selectedDate = date;
    this.showPromoForm = true;
  }

  // Lưu khuyến mãi
  savePromotion() {
    if (this.selectedTour && this.selectedDate) {
      const key = `${this.selectedTour.id}_${this.selectedDate.toDateString()}`;
      this.promotions[key] = true;
    }
    this.cancelPromotion();
  }

  // Hủy bỏ khuyến mãi
  cancelPromotion() {
    this.showPromoForm = false;
    this.selectedDate = null;
  }
  searchTours() {
    const query = this.searchQuery.toLowerCase();
    this.filteredTours = this.tours.filter(tour =>
      tour.name.toLowerCase().includes(query)
    );
    this.totalPages = Math.ceil(this.filteredTours.length / this.pageSize);
    this.changePage(1); // Hiển thị trang đầu tiên sau khi lọc
  }
}
