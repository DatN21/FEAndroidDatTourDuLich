import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgClass, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms'; // ✅ Import đúng module
import { TourScheduleResponse } from '../response/TourScheduleResponse';
import { TourService } from '../service/tours.service';
import { RouterModule } from '@angular/router';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-quan-ly-lich-trinh',
  standalone: true,
  imports: [CommonModule, FormsModule], // ✅ import NgClass thay vì CommonModule
  providers: [TourService], // Add TourService to the providers array
  templateUrl: './quan-ly-lich-trinh.component.html',
  styleUrls: ['./quan-ly-lich-trinh.component.scss'] // sửa lại từ `styleUrl` -> `styleUrls`
})
export class QuanLyLichTrinhComponent implements OnInit{
  tourSchedule: TourScheduleResponse[] = [];
  isAdding: boolean = false;
  itineraries: any[] = [];
  errorMessage: string = ''; // Declare the errorMessage property
  selectedStatus: string = ''; // Declare the selectedStatus property
  constructor(private tourService: TourService, private router: Router,private route: ActivatedRoute,) { } // Khởi tạo constructor nếu cần thiết
  newItinerary = {
    departureDate: '',
    totalSeats: null
  };
  ngOnInit(): void {
    const tourId = Number(this.route.snapshot.params['id']);
    this.getTourSchedule(tourId); // Gọi hàm này với id tour cụ thể
  }
  addItinerary(): void {
    const { departureDate, totalSeats } = this.newItinerary;

    this.itineraries.push({
      departureDate: new Date(departureDate),
      totalSeats: totalSeats,
      availableSeats: totalSeats,
      status: 'ACTIVE'
    });

    // Reset form
    this.newItinerary = { departureDate: '', totalSeats: null };
    this.isAdding = false;
  }
  // Các phương thức khác của component có thể được định nghĩa ở đây
  filteredItineraries() {
    if (!this.selectedStatus) {
      return this.itineraries;
    }
    return this.itineraries.filter(i => i.status === this.selectedStatus);
  }

  private getTourSchedule(id:number): void {
  this.tourService.getAllTourSchedule(id).subscribe({
    next: (tourSchedule: TourScheduleResponse[]) => {
      if (tourSchedule && tourSchedule.length > 0) {
        this.tourSchedule = tourSchedule;
      }
    },
    error: (error) => {
      console.error('Lỗi khi lịch trình tour:', error);
      this.errorMessage = 'Không thể tải lịch trình tour.';
      this.tourSchedule = [];
    }
  });
}
}
