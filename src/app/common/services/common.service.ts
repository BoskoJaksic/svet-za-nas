import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { Subject } from 'rxjs';
import { Capacitor } from '@capacitor/core';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  constructor(private router: Router, private platform: Platform) {}

  determinePlatform() {
    return Capacitor.getPlatform();
  }
  isIos() {
    return this.platform.is('ios');
  }

  goToRoute(whereTo: any, params?: any) {
    if (params) {
      this.router.navigate([whereTo, params]);
    } else {
      this.router.navigate([whereTo]);
    }
  }

  navigateToRoute(route: string) {
    this.router.navigate([route]);
  }

  isSmallScreen() {
    const screenHeight = this.platform.height();
    return screenHeight < 700;
  }
}
