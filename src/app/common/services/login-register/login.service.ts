import { Injectable } from '@angular/core';
import { ApiService } from '../../../core/api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(private apiService: ApiService) {}

  loginUser(data: any): Observable<any> {
    return this.apiService.post('ApplicationUsers/LoginUser', data);
  }

  googleLoginIn(data: any): Observable<any> {
    return this.apiService.post('ApplicationUsers/GoogleLogin', data);
  }

  facebookLoginIn(token: any): Observable<any> {
    return this.apiService.post(`ApplicationUsers/FacebookLogin/${token}`, token);
  }
  appleLogin(token: any): Observable<any> {
    return this.apiService.post(`ApplicationUsers/AppleLogin/${token}`, token);
  }
}
