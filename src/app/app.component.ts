import {Component, NgZone} from '@angular/core';
import {Platform} from "@ionic/angular";
import {LoaderService} from "./common/services/loader.service";
import {App, URLOpenListenerEvent} from "@capacitor/app";
import {AppPathService} from "./common/services/app-path.service";
import {isPlatform} from "@ionic/angular";
import {GoogleAuth} from "@codetrix-studio/capacitor-google-auth";
import {CommonService} from "./common/services/common.service";
import {Router} from "@angular/router";
import {Capacitor} from "@capacitor/core";

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
      if (!isPlatform('capacitor')){
        GoogleAuth.initialize();
      }
      // this.splashScreen.hide();
    });
  }
  // determinePlatform() {
  //   this.isWebPlatform = this.commonService.determinePlatform() === 'web';
  // }
  deepLinkApp(){
    console.log('from deepLInk beggiing',this.commonService.determinePlatform())
    App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
      this.ngZone.run( () => {
        const slug = event.url.split(".eu");
        let appPath = slug.pop()
        console.log('appPath',appPath)

        if (this.commonService.determinePlatform() === 'web') {
          console.log('isWeb')
          // If the app is running on the web, add the '/log-register/' segment to the URL
          appPath = '/login-register' + appPath;
        }

        if (appPath) {
          this.appPathService.setAppPath(appPath)
          this.router.navigate(['']);
        }
      });
    });
  }
}
