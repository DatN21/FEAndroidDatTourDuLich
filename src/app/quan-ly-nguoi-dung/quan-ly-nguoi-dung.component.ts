import { Component, OnInit } from '@angular/core';
import { UserService } from '../service/user.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User } from '../model/user';

@Component({
  selector: 'app-quan-ly-nguoi-dung',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './quan-ly-nguoi-dung.component.html',
  styleUrls: ['./quan-ly-nguoi-dung.component.scss']
})
export class QuanLyNguoiDungComponent implements OnInit {
  successMessage: string = '';
  errorMessage: string = '';
  currentPage: number = 0;
  itemsPerPage: number = 10;
  totalPages: number = 0;
  visiblePages: number[] = [];  
  users: User[] = [];
  editableRowId: number | null = null;

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit() {
    this.getUsers(this.currentPage, this.itemsPerPage);
  }

  // Tạo mảng các trang hiển thị
  generateVisiblePageArray(currentPage: number, totalPages: number): number[] {
    const maxVisiblePages = 5;
    const halfVisiblePages = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(currentPage - halfVisiblePages, 0);
    let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(endPage - maxVisiblePages + 1, 0);
    }

    return new Array(endPage - startPage + 1).fill(0).map((_, index) => startPage + index);
  }

  // Hàm xử lý khi người dùng thay đổi trang
  onPageChange(page: number) {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.getUsers(this.currentPage, this.itemsPerPage);
    }
  }

  // Lấy danh sách người dùng từ backend
  getUsers(page: number, limit: number) {
    this.userService.getAllUsers(page, limit).subscribe({
      next: (response: any) => {
        if (response && response.userResponses) {
          this.users = response.userResponses;
          this.totalPages = response.totalPages;
          this.visiblePages = this.generateVisiblePageArray(this.currentPage, this.totalPages);
        } else {
          console.error('Cấu trúc phản hồi từ backend không đúng:', response);
        }
      },
      error: (error: any) => {
        console.error('Lỗi khi lấy dữ liệu người dùng:', error);
        this.errorMessage = 'Không thể tải dữ liệu người dùng. Vui lòng thử lại!';
      }
    });
  }

  // Chỉnh sửa thông tin người dùng
  editRow(id: number) {
    this.editableRowId = id;
  }

  // Cập nhật thông tin người dùng
  updateRow(user: User) {
    this.userService.updateUserByAdmin(user.id, user).subscribe({
      next: (response: any) => {
        this.successMessage = `Thông tin của người dùng ${user.name} đã được cập nhật!`;
        this.editableRowId = null;
        this.getUsers(this.currentPage, this.itemsPerPage);
      },
      error: (error: any) => {
        console.error('Lỗi khi cập nhật người dùng:', error);
        this.errorMessage = 'Cập nhật không thành công, vui lòng thử lại!';
      }
    });
  }

  // Xóa người dùng
  onDelete(id: number) {
    const confirmDelete = window.confirm('Bạn có chắc chắn muốn xóa người dùng này?');
    if (confirmDelete) {
      this.userService.deleteUser(id).subscribe({
        next: (response: any) => {
          this.successMessage = `Người dùng với ID ${id} đã được xóa!`;
          this.getUsers(this.currentPage, this.itemsPerPage);
        },
        error: (error: any) => {
          console.error('Lỗi khi xóa người dùng:', error);
          this.errorMessage = 'Không thể xóa người dùng. Vui lòng thử lại!';
        }
      });
    }
  }
  
}
