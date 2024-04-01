import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {LoaderService} from "../../../common/services/loader.service";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";

@Component({
  selector: 'app-in-app-browser',
  templateUrl: './in-app-browser.page.html',
  styleUrls: ['./in-app-browser.page.scss'],
})
export class InAppBrowserPage implements OnInit {
  children: any
  vidUrl!: SafeResourceUrl
  // baseUrl = 'https://svetzanas.rs/kategorija-nezno-doba/'

  baseUrl = 'https://www.vijesti.me/'

  constructor(
    private loaderService: LoaderService,
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
      setTimeout(() => {
        this.loaderService.hideLoader();
      }, 200);
    });
  }
}
