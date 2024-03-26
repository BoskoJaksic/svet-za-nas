
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() {
  }

  setUserId(userId: any) {
    localStorage.setItem('userId', userId);
  }

  getUserId() {
    return localStorage.getItem('userId');
  }

  setUserEmail(userEmail: any) {
    localStorage.setItem('userEmail', userEmail);
  }

  getUserEmail() {
    return localStorage.getItem('userEmail');
  }

  setUserToken(userToken: any) {
    localStorage.setItem('userToken', userToken);
  }

  getUserToken() {
    return localStorage.getItem('userToken');
  }

  setUserRefreshToken(userRefreshToken: any) {
    localStorage.setItem('userRefreshToken', userRefreshToken);
  }

  getUserRefreshToken(): any {
    return localStorage.getItem('userRefreshToken');
  }

  clearLocalStorage() {
    localStorage.clear();
  }
}

