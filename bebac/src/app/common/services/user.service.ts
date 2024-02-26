import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {ApiService} from "../../core/api.service";


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private apiService: ApiService) {
  }

  getUserDataByEmail(email: any): Observable<any> {
    return this.apiService.get(`ApplicationUsers/GetByEmail/${email}`);
  }

}
