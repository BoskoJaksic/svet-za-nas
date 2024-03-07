import {Injectable} from '@angular/core';
import {LoadingController} from '@ionic/angular';
import {BehaviorSubject, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  constructor() {
  }

  private loaderVisibilitySubject = new BehaviorSubject<boolean>(false);
  loaderVisibility$ = this.loaderVisibilitySubject.asObservable();

  showLoader() {
    this.loaderVisibilitySubject.next(true);
  }

  hideLoader() {
    this.loaderVisibilitySubject.next(false);
  }
}
