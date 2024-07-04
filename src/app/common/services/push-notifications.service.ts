import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../core/api.service';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class PushNotificationsService {
  constructor(private apiService: ApiService) {}

  addPushNotificationDevice(obj: any) {
    return this.apiService.post(
      'PushNotifications/AddPushNotificationDevice',
      obj
    );
  }

  sendPushNotification(obj: any) {
    return this.apiService.post('PushNotifications/SendPushNotification', obj);
  }
}
