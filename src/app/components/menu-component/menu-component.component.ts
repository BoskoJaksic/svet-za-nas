import {Component, Input, OnInit} from '@angular/core';
import {filter} from "rxjs";
import {NavigationEnd, Router} from "@angular/router";
import {CommonService} from "../../common/services/common.service";
import {GoogleAuth} from "@codetrix-studio/capacitor-google-auth";
import {LocalStorageService} from "../../common/services/local-storage.service";
import {FacebookLogin} from "@capacitor-community/facebook-login";

@Component({
  selector: 'app-menu-component',
  templateUrl: './menu-component.component.html',
  styleUrls: ['./menu-component.component.scss'],
})
export class MenuComponentComponent implements OnInit {

  pageTitle: string = '';
  @Input() sidebarsUrl: any;

  constructor(private router: Router,
              private localStorageService: LocalStorageService,
              private commonService: CommonService
  ) {

  }

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      let route = this.router.routerState.root;
      while (route.firstChild) route = route.firstChild;
      route.data.subscribe((data: any) => {
        this.pageTitle = data['title'];
      });
    });
  }


  async logout() {
    await GoogleAuth.signOut();
    if (this.localStorageService.getIsFromFacebookLoggedIn() === 'true'){
      await FacebookLogin.logout();
    }
    this.localStorageService.clearLocalStorage();
    this.commonService.goToRoute('');
  }

}
