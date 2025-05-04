import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-yeu-cau-dat',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './yeu-cau-dat.component.html',
  styleUrls: ['./yeu-cau-dat.component.scss']  // Sử dụng styleUrls thay vì styleUrl
})
export class YeuCauDatComponent {
  // Đây là nơi bạn có thể thêm logic cho component nếu cần
  contactForm: FormGroup;

  passengerGroups = [
    { key: 'adult', label: 'Người lớn', description: 'Từ 12 tuổi trở lên', count: 0, img: 'nguoilon.jpg' },
    { key: 'child', label: 'Trẻ em', description: 'Từ 2 đến 4 tuổi', count: 0, img: 'treem.jpg' },
    { key: 'kid', label: 'Trẻ nhỏ', description: 'Từ 5 đến 12 tuổi', count: 0, img: 'treem.jpg' },
    { key: 'baby', label: 'Em bé', description: 'Dưới 2 tuổi', count: 0, img: 'embe.jpg' },
  ];

  passengers: { [key: string]: any[] } = {
    adult: [],
    child: [],
    kid: [],
    baby: [],
  };

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      name: [''],
      phone: [''],
      email: [''],
      address: [''],
    });
  }

  increase(type: string) {
    const group = this.passengerGroups.find(g => g.key === type);
    if (group) {
      group.count++;
      this.passengers[type].push({ name: '', gender: '', dob: '', singleRoom: false });
    }
  }

  decrease(type: string) {
    const group = this.passengerGroups.find(g => g.key === type);
    if (group && group.count > 0) {
      group.count--;
      this.passengers[type].pop();
    }
  }

  getPassengerList(type: string) {
    return this.passengers[type];
  }
}
