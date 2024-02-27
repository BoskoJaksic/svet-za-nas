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
  // baseUrl = this.getApiUrl();

  constructor(private http: HttpClient, private platform: Platform) {
  }


  getApiUrl(): string {
    if (this.platform.is('android')) {
      // 192.168.0.17 real device
      // 10.0.2.2 emulator
      return 'https://192.168.8.37:7295/api/';
    } else if (this.platform.is('ios')) {
      return 'https://192.168.79.61:5001/api/';
    } else {
      // Default URL for other platforms or when running in the browser
      return 'https://192.168.79.61:5001/api/';
    }
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
