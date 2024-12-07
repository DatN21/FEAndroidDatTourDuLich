import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RegisterDTO } from '../dtos/user/register.dto';
import { LoginDTO } from '../dtos/user/login.dto';
import {enviroment} from '../enviroments/enviroments'
import { map } from 'rxjs/operators'; 
import {UserResponse} from '../response/user.response'
import {AuthService} from '../service/auth.service'
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiRegister = `${enviroment.apiBaseUrl}/users/register` ;
  private apiLogin = `${enviroment.apiBaseUrl}/users/login` ;
  private apiUserDetail = `${enviroment.apiBaseUrl}/users/details` ;
  private apiUrl = enviroment.apiBaseUrl + '/users'; 
  private apiConfig = {
    headers: this.createHeaders() ,
  }

  constructor(private http: HttpClient,private authService: AuthService) { }

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
getUserDetail(token: string) {
  return this.http.post(this.apiUserDetail, {}, {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    })
  });
}

  saveUserResponseToLocalStorage(userResponse?: UserResponse) {
    try {
      debugger
      if(userResponse == null || !userResponse) {
        return;
      }
      // Convert the userResponse object to a JSON string
      const userResponseJSON = JSON.stringify(userResponse);  
      // Save the JSON string to local storage with a key (e.g., "userResponse")
      localStorage.setItem('user', userResponseJSON);  
      console.log('User response saved to local storage.');
    } catch (error) {
      console.error('Error saving user response to local storage:', error);
    }
  }

  updateUserByAdmin(id: number, userDTOUpdate: any): Observable<any> {
    const url = `${this.apiUrl}/admin/${id}`;

    return this.authService.putWithAuthHeader(url, userDTOUpdate);
  }

  getAllUsers(page: number, limit: number): Observable<any> {
    const url = `${this.apiUrl}/full?page=${page}&limit=${limit}`;
    return this.authService.getWithAuthHeader(url);
  }

  deleteUser(id: number) {
    const url = `${this.apiUrl}/${id}` ;
    return this.authService.deleteWithAuthHeader(url);
}

updateUser(id: number, userDTOUpdate: any): Observable<any> {
  const url = `${this.apiUrl}/${id}`;

  return this.authService.putWithAuthHeader(url, userDTOUpdate);
}
}
