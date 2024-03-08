import {Component} from '@angular/core';
import {Platform} from "@ionic/angular";
import {LoaderService} from "./common/services/loader.service";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  constructor(private platform: Platform,
              public loaderService: LoaderService,
  ) {
    this.initializeApp()
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // this.splashScreen.hide();
      // GoogleAuth.initialize()
    });
  }
}
