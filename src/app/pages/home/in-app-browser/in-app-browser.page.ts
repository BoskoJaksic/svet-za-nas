import {Component, Input, NgZone, OnInit} from '@angular/core';
import {filter, Subject, takeUntil} from "rxjs";
import {ActivatedRoute, Event as NavigationEvent, NavigationEnd, Router,} from "@angular/router";
import {CommonService} from "../../../common/services/common.service";
import {UserService} from "../../../common/services/user.service";
import {LocalStorageService} from "../../../common/services/local-storage.service";
import {LoaderService} from "../../../common/services/loader.service";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";

@Component({
  selector: 'app-in-app-browser',
  templateUrl: './in-app-browser.page.html',
  styleUrls: ['./in-app-browser.page.scss'],
})
export class InAppBrowserPage implements OnInit {
  private firstLoad: boolean = true;
  private destroy$: Subject<boolean> = new Subject<boolean>();
  children: any
  vidUrl!: SafeResourceUrl
  baseUrl = 'https://promo.maxbet.rs/?tm=tt&ap=gads&aaid=ada5EZi66u4ZQ&gclid=Cj0KCQjwqpSwBhClARIsADlZ_TltatqhSBSQtwF96VbdqnmXcb4C51noNp5NGjaicWnRuO5aqR1o0aEaArl0EALw_wcB'

  constructor(private router: Router,
              private ngZone: NgZone,
              private commonService: CommonService,
              private loaderService: LoaderService,
              private localStorageService: LocalStorageService,
              private userService: UserService,
              private domSanitizer: DomSanitizer,
              private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.loaderService.showLoader();
      if (params['data']) {
        try {
          const encodedObject = params['data'];
          const urlToUse = JSON.parse(decodeURIComponent(encodedObject));
          console.log('urlToUse', urlToUse);
          this.vidUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(urlToUse);
        } catch (error) {
          console.error('Error parsing or sanitizing URL:', error);
          // Handle the error, e.g., set a default URL or display an error message
          this.vidUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(this.baseUrl);
        }
      } else {
        // Handle if 'data' parameter is missing
        this.vidUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(this.baseUrl);
      }
      console.log('link to host:', this.vidUrl);
      setTimeout(() => {
        this.loaderService.hideLoader();
      }, 100);
    });
  }
}
