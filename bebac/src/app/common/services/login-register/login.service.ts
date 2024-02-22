import {Injectable} from '@angular/core';
import {ApiService} from "../../../core/api.service";
import {Observable} from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private apiService: ApiService) {
  }

  loginUser(data: any): Observable<any> {
    return this.apiService.post('ApplicationUsers/LoginUser', data);
  }

}
