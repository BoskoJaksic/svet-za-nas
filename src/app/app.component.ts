import {Component, NgZone} from '@angular/core';
import {isPlatform, Platform} from "@ionic/angular";
import {LoaderService} from "./common/services/loader.service";
import {App, URLOpenListenerEvent} from "@capacitor/app";
import {AppPathService} from "./common/services/app-path.service";
import {GoogleAuth} from "@codetrix-studio/capacitor-google-auth";
import {CommonService} from "./common/services/common.service";
import {Router} from "@angular/router";
import {FacebookLogin} from "@capacitor-community/facebook-login";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  // isWebPlatform:boolean = false;
  constructor(private platform: Platform,
              public loaderService: LoaderService,
              public appPathService: AppPathService,
              public commonService: CommonService,
              private router: Router,
              private ngZone: NgZone
  ) {
    this.initializeApp();
    this.deepLinkApp();
    // this.determinePlatform();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      if (!isPlatform('capacitor')) {
        GoogleAuth.initialize();
        FacebookLogin.initialize({appId: '1160818081589095'});
      }
      // this.splashScreen.hide();
    });
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
          const slug = event.url.split(".eu/");
          let appPath = slug.pop()
          console.log('appPath', appPath)

          if (appPath !== '') {
            this.router.navigate([`login-register/${appPath}`]);
          } else {
            this.router.navigate([`login-register/false`]);
          }
        });
      });
    }

  }
}
