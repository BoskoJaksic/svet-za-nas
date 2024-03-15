import {Component, NgZone} from '@angular/core';
import {Platform} from "@ionic/angular";
import {LoaderService} from "./common/services/loader.service";
import {App, URLOpenListenerEvent} from "@capacitor/app";
import {AppPathService} from "./common/services/app-path.service";
import {isPlatform} from "@ionic/angular";
import {GoogleAuth} from "@codetrix-studio/capacitor-google-auth";
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  constructor(private platform: Platform,
              public loaderService: LoaderService,
              public appPathService: AppPathService,
              private ngZone: NgZone,
  ) {
    this.initializeApp();
    this.deepLinkApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      if (!isPlatform('capacitor')){
        GoogleAuth.initialize();
      }
      // this.splashScreen.hide();
    });
  }
  deepLinkApp(){
    App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
      this.ngZone.run(() => {
        const slug = event.url.split(".net");
        const appPath = slug.pop()
        if (appPath) {
          this.appPathService.setAppPath(appPath)
        }
      });
    });
  }


}
