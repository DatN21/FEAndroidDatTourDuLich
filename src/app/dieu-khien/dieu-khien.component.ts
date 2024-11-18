import { Component } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { FooterComponent } from "../footer/footer.component";
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-dieu-khien',
  standalone: true,
  imports: [HeaderComponent,FooterComponent,RouterModule],
  templateUrl: './dieu-khien.component.html',
  styleUrl: './dieu-khien.component.scss'
})
export class DieuKhienComponent {

}
