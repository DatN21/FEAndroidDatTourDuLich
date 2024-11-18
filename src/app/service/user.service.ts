import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RegisterDTO } from '../dtos/user/register.dto';
import { LoginDTO } from '../dtos/user/login.dto';
import {enviroment} from '../enviroments/enviroments'
import { map } from 'rxjs/operators'; 

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiRegister = `${enviroment.apiBaseUrl}/users/register` ;
  private apiLogin = `${enviroment.apiBaseUrl}/users/login` ;
  private apiConfig = {
    headers: this.createHeaders() ,
  }

  constructor(private http: HttpClient) { }

  private createHeaders():HttpHeaders{
    return new HttpHeaders({'Content-Type' : 'application/json'}) ;
  }

  register(registerDTO: RegisterDTO):Observable<any>{
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.post(this.apiRegister,registerDTO, this.apiConfig) ;
  }

  login(loginDTO: LoginDTO): Observable<any> {
    return this.http.post(this.apiLogin, loginDTO, this.apiConfig).pipe(
        map((response: any) => {
            // Xác minh rằng phản hồi chứa token
            if (response && response.token) {
                return response.token; // Hoặc trả về một đối tượng có token
            } else {
                throw new Error('Invalid response format'); // Ném lỗi nếu không có token
            }
        })
    );
}

}
