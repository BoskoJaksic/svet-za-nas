import {Component, NgZone} from '@angular/core';
import {isPlatform, Platform} from "@ionic/angular";
import {LoaderService} from "./common/services/loader.service";
import {App, URLOpenListenerEvent} from "@capacitor/app";
import {AppPathService} from "./common/services/app-path.service";
import {GoogleAuth} from "@codetrix-studio/capacitor-google-auth";
import {CommonService} from "./common/services/common.service";
import {Router} from "@angular/router";

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
      }
      // this.splashScreen.hide();
    });
  }

  // determinePlatform() {
  //   this.isWebPlatform = this.commonService.determinePlatform() === 'web';
  // }
  deepLinkApp() {
    if (this.commonService.determinePlatform() === 'web') {
      let url = window.location.href;
      // let slug = url.split(".eu/");
      let slug = url.split("localhost:4200/");
      let appPath = slug.pop()
      console.log('appPath', appPath)

      if (appPath !== '') {
        this.router.navigate([`login-register/${appPath}`]);
      }else{
        this.router.navigate([`login-register/false`]);
      }

    } else {
      App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
        this.ngZone.run(() => {
          const slug = event.url.split(".eu/");
          let appPath = slug.pop()
          console.log('appPath', appPath)

          if (appPath !== '') {
            this.router.navigate([`login-register/${appPath}`]);
          }else{
            this.router.navigate([`login-register/false`]);
          }
        });
      });
    }

  }
}
