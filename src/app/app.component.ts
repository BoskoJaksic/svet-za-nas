import { Component, NgZone, OnInit } from '@angular/core';
import { AlertController, isPlatform, Platform } from '@ionic/angular';
import { LoaderService } from './common/services/loader.service';
import { App, URLOpenListenerEvent } from '@capacitor/app';
import { AppPathService } from './common/services/app-path.service';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { CommonService } from './common/services/common.service';
import { Router } from '@angular/router';
import { FacebookLogin } from '@capacitor-community/facebook-login';
import { LocalStorageService } from './common/services/local-storage.service';
import { jwtDecode } from 'jwt-decode';
import { switchMap } from 'rxjs';
import { UserService } from './common/services/user.service';
import {
  ActionPerformed,
  PushNotification,
  PushNotificationActionPerformed,
  PushNotificationSchema,
  PushNotificationToken,
  PushNotifications,
  Token,
} from '@capacitor/push-notifications';
import { PushNotificationsService } from './common/services/push-notifications.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  // isWebPlatform:boolean = false;
  constructor(
    private platform: Platform,
    public loaderService: LoaderService,
    public appPathService: AppPathService,
    public commonService: CommonService,
    private router: Router,
    private ngZone: NgZone,
    private localStorageService: LocalStorageService,
    private userService: UserService
  ) {
    this.initializeApp();
    this.deepLinkApp();
    // this.determinePlatform();
  }

  ngOnInit() {
    if (this.platform.is('android') || this.platform.is('ios')) {
      this.initializePushNotifications();
    }
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.rememberMeRedirect();
      if (!isPlatform('capacitor')) {
        GoogleAuth.initialize();
        FacebookLogin.initialize({ appId: '1160818081589095' });
      }
      // this.splashScreen.hide();
    });
  }

  rememberMeRedirect() {
    let jwt = this.localStorageService.getUserToken();
    if (jwt) {
      let decoded: any = jwtDecode(jwt);
      let isPersistent = decoded.isPersistent === 'true' ? true : false;
      if (isPersistent) {
        if (decoded.exp > Date.now() / 1000) {
          this.commonService.goToRoute('home');
        } else {
          let dataToSend = {
            accessToken: this.localStorageService.getUserToken(),
            refreshToken: this.localStorageService.getUserRefreshToken(),
          };
          this.userService
            .getRefreshToken(dataToSend)
            .subscribe((response: any) => {
              const newToken = response.accessToken;
              const newRefreshToken = response.refreshToken;

              if (newToken && newRefreshToken) {
                this.localStorageService.setUserToken(newToken);
                this.localStorageService.setUserRefreshToken(newRefreshToken);
                this.commonService.goToRoute('home');
              }
            });
        }
      }
    }
  }

  // determinePlatform() {
  //   this.isWebPlatform = this.commonService.determinePlatform() === 'web';
  // } todo login-register/false  login-register/id  home/profile home/in-app-browser home/settings

  deepLinkApp() {
    if (this.commonService.determinePlatform() === 'web') {
      // // todo uncomment this for production
      // let url = window.location.href;
      // let slug = url.split(".eu/");
      // // let slug = url.split("localhost:4200/");
      //
      // let appPath = slug.pop()
      // console.log('appPath', appPath)
      // if (appPath === 'login-register/false') {
      //   this.router.navigate([`login-register/false`]);
      //   return;
      // }
      // if (appPath?.startsWith('home')){
      //   this.router.navigate([appPath]);
      //   return;
      // }
      //
      // if (appPath !== '') {
      //   this.router.navigate([`login-register/${appPath}`]);
      //   return;
      // }
    } else {
      App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
        this.ngZone.run(() => {
          const slug = event.url.split('.eu/');
          let appPath = slug.pop();
          console.log('appPath', appPath);

          if (appPath !== '') {
            this.router.navigate([`login-register/${appPath}`]);
          } else {
            this.router.navigate([`login-register/false`]);
          }
        });
      });
    }
  }

  initializePushNotifications() {
    // With this method, user will be asked to allow push notifications on app start
    // Registering app is going on in home.page.ts so we have information about user
    PushNotifications.requestPermissions().then((result: any) => {});
  }
}
