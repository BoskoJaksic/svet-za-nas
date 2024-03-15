import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {ApiService} from "../../core/api.service";
import {LocalStorageService} from "./local-storage.service";


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private apiService: ApiService,
              private localStorageService: LocalStorageService
              ) {
  }

  getUserDataByEmail(email: any): Observable<any> {
    return this.apiService.get(`ApplicationUsers/GetByEmail/${email}`);
  }

  deleteAccount(email: any): Observable<any> {
    return this.apiService.delete(`ApplicationUsers/DeleteUser/${email}`);
  }

  isUserLoggedIn() {
    let userToken = this.localStorageService.getUserToken()
    return !!userToken;
  }

  getRefreshToken(userRefreshToken:string){
    return this.apiService.post('ApplicationUsers/GetrefreshToken',userRefreshToken);
  }
}
