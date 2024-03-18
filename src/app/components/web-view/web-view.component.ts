import { Component, OnInit } from '@angular/core';
import {CommonService} from "../../common/services/common.service";

@Component({
  selector: 'app-web-view',
  templateUrl: './web-view.component.html',
  styleUrls: ['./web-view.component.scss'],
})
export class WebViewComponent  implements OnInit {

  constructor(public commonService:CommonService) { }

  ngOnInit() {}

  downloadAppStore() {
    const appStoreLink = '';
    window.open(appStoreLink, '_blank');

  }

  downloadPlayStore() {
    const appStoreLink = '';
    window.open(appStoreLink, '_blank');
  }

}
