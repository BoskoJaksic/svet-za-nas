import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() {
  }


  setUserEmail(userEmail: any) {
    localStorage.setItem('userEmail', userEmail);
  }

  getUserEmail() {
    return localStorage.getItem('userEmail');
  }

  clearLocalStorage() {
    localStorage.clear();
  }
}
