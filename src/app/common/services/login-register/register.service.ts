import {Injectable} from '@angular/core';
import {ApiService} from "../../../core/api.service";
import {Observable} from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(private apiService: ApiService) {
  }

  registerUser(data: any): Observable<any> {
    return this.apiService.post('ApplicationUsers/RegisterUser', data);
  }
  registerPartner(data: any): Observable<any> {
    return this.apiService.post('ApplicationUsers/RegisterPartner', data);
  }

}
