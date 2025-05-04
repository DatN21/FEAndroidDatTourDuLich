import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgClass, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms'; // ✅ Import đúng module

@Component({
  selector: 'app-quan-ly-lich-trinh',
  standalone: true,
  imports: [CommonModule,FormsModule ], // ✅ import NgClass thay vì CommonModule
  templateUrl: './quan-ly-lich-trinh.component.html',
  styleUrls: ['./quan-ly-lich-trinh.component.scss'] // sửa lại từ `styleUrl` -> `styleUrls`
})
export class QuanLyLichTrinhComponent implements OnInit{
  isAdding: boolean = false;
  itineraries: any[] = [];
  selectedStatus: string = '';
  constructor() { } // Khởi tạo constructor nếu cần thiết
  newItinerary = {
    departureDate: '',
    totalSeats: null
  };
  ngOnInit(): void {
    // Gọi hàm khởi tạo dữ liệu ở đây nếu cần
    this.itineraries = [
     { departureDate: new Date('2025-05-01'), totalSeats: 40, availableSeats: 10, status: 'ACTIVE' },
      { departureDate: new Date('2025-05-10'), totalSeats: 30, availableSeats: 5, status: 'ACTIVE' },
      { departureDate: new Date('2025-04-25'), totalSeats: 20, availableSeats: 0, status: 'ACTIVE' }
    ];
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
}
