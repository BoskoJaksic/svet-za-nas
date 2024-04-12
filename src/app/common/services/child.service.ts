import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {ApiService} from "../../core/api.service";
import {LocalStorageService} from "./local-storage.service";


@Injectable({
  providedIn: 'root'
})
export class ChildService {

  constructor(private apiService: ApiService,
              private localStorageService: LocalStorageService
  ) {
  }


  deleteChild(data: any): Observable<any> {
    return this.apiService.delete(`Children/DeleteChild`,data);
  }

  addChild(obj: any) {
    return this.apiService.post('Children/AddChild', obj);
  }

  editChild(obj: any) {
    return this.apiService.put('Children/UpdateChild', obj);
  }

}
