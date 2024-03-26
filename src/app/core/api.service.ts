import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Platform} from "@ionic/angular";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  // baseUrl = environment.baseURL
  baseUrl = this.getApiUrl();

  constructor(private http: HttpClient, private platform: Platform) {
  }


  // 2E:4B:E3:F3:2A:9D:4E:C4:E5:0C:56:11:02:8F:D6:A7:C9:4D:29:08 production sha key

  getApiUrl(): string {
    if (this.platform.is('android')) {
      // 192.168.0.17 real device
      // 10.0.2.2 emulator
      return 'http://10.0.2.2:5001/api/';
    } else if (this.platform.is('ios')) {
      return 'http://127.0.0.1:5001/api/';
    } else {
      // Default URL for other platforms or when running in the browser
      return 'http://localhost:5001/api/';
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

  delete(path: string): Observable<any> {
    return this.http.delete(this.baseUrl + path);
  }
}
