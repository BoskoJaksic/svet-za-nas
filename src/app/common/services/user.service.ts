import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../core/api.service';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private apiService: ApiService,
    private localStorageService: LocalStorageService
  ) {}

  getUserDataByEmail(email: any): Observable<any> {
    return this.apiService.get(`ApplicationUsers/GetByEmail/${email}`);
  }

  deleteAccount(email: any): Observable<any> {
    return this.apiService.delete(`ApplicationUsers/DeleteUser/${email}`);
  }

  isUserLoggedIn() {
    let userToken = this.localStorageService.getUserToken();
    return !!userToken;
  }

  getRefreshToken(userRefreshToken: any) {
    return this.apiService.post(
      'ApplicationUsers/RefreshToken',
      userRefreshToken
    );
  }

  changeUserImg(obj: any) {
    return this.apiService.post('FileUpload/ChangeProfilePicture', obj);
  }

  deleteOtherParent(id: any) {
    return this.apiService.delete(`ApplicationUsers/DeleteOtherParent/${id}`);
  }

  updateUser(obj: any) {
    return this.apiService.put('ApplicationUsers/UpdateUser', obj);
  }

  getAllUsers(obj: any) {
    return this.apiService.post('ApplicationUsers/GetAll', obj);
  }

  forgotPassword(email: any) {
    return this.apiService.post(`ApplicationUsers/ForgotPassword/${email}`, {});
  }

  resetPassword(obj: any) {
    return this.apiService.post('ApplicationUsers/ResetPassword', obj);
  }
}
