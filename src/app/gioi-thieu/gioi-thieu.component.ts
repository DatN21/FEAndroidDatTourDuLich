import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { RouterModule } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HomeComponent } from "../home/home.component";
@Component({
  selector: 'app-gioi-thieu',
  standalone: true,
  templateUrl: './gioi-thieu.component.html',
  styleUrls: ['./gioi-thieu.component.scss'],
  imports: [RouterModule, HeaderComponent,HomeComponent],  // Đảm bảo HeaderComponent nằm trong imports
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class GioiThieuComponent {}
