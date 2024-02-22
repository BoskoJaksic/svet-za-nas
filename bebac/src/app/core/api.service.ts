import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Platform} from "@ionic/angular";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  baseUrl = environment.baseURL

  constructor(private http: HttpClient, private platform: Platform) {
  }


  get(path: string): Observable<any> {
    return this.http.get(this.baseUrl + path);
  }

  post(path: string, data: any, options?: any): Observable<any> {
    return this.http.post(this.baseUrl + path, data, options);
  }

  put(path: string, data: any): Observable<any> {
    return this.http.put(this.baseUrl + path, data);
  }
  patch(path: string, data: any): Observable<any> {
    return this.http.patch(this.baseUrl + path, data);
  }

  delete(path: string, data: any): Observable<any> {
    return this.http.delete(this.baseUrl + path, data);
  }
}
