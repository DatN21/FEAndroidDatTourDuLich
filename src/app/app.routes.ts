import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GioiThieuComponent } from './gioi-thieu/gioi-thieu.component'; // Đảm bảo bạn đã import component này
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component'
import { RegisterComponent } from './register/register.component'
import {ThemMoiTourComponent} from './them-moi-tour/them-moi-tour.component'
import { QuanLyTourComponent } from './quan-ly-tour/quan-ly-tour.component';
import {QuanLyBookingComponent} from './quan-ly-booking/quan-ly-booking.component'
import {ThemAnhComponent} from './them-anh/them-anh.component'
import {SuaThongTinTourComponent} from './sua-thong-tin-tour/sua-thong-tin-tour.component'
import {TourDetailComponent} from './tour-detail/tour-detail.component'
export const routes: Routes = [
    {
        path: 'gioi-thieu', // URL sẽ được sử dụng để điều hướng
        component: GioiThieuComponent // Component sẽ được hiển thị khi truy cập vào URL trên
    },
    // { path: '', component: HomeComponent },
    { path: 'dang-nhap', component: LoginComponent },
    { path: 'dang-ky', component: RegisterComponent },
    { path: 'them-moi-tour', component: ThemMoiTourComponent },
    { path: 'app-quan-ly-tour', component: QuanLyTourComponent },
    { path: 'admin', component: QuanLyTourComponent },
    { path: 'quan-ly-booking', component: QuanLyBookingComponent },
    { path: 'them-anh/:id', component: ThemAnhComponent },
    { path: '', component: HomeComponent },
    { path: 'sua-thong-tin-tour/:id', component: SuaThongTinTourComponent },
    { path: 'tour-detail/:id', component: TourDetailComponent },
];
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule {}