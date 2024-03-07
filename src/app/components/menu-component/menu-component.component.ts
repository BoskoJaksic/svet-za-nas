import {Component, Input, OnInit} from '@angular/core';
import {filter} from "rxjs";
import {NavigationEnd, Router} from "@angular/router";
import {CommonService} from "../../common/services/common.service";
import {GoogleAuth} from "@codetrix-studio/capacitor-google-auth";
import {LocalStorageService} from "../../common/services/local-storage.service";
import {ToasterService} from "../../common/services/toaster.service";
import {UserService} from "../../common/services/user.service";

@Component({
  selector: 'app-menu-component',
  templateUrl: './menu-component.component.html',
  styleUrls: ['./menu-component.component.scss'],
})
export class MenuComponentComponent implements OnInit {
  public alertButtons = [
    {
      text: 'Ponisti',
      role: 'cancel',
      handler: () => {
        console.log('Alert canceled');
      },
    },
    {
      text: 'Obrisi',
      role: 'confirm',
      handler: () => {
        console.log('Alert confirmed');
      },
    },
  ];

  pageTitle: string = '';
  @Input() sidebarsUrl: any;
  selectedPageUrl: string = '';

  constructor(private router: Router,
              private localStorageService: LocalStorageService,
              private toasterService: ToasterService,
              private userService: UserService,
              private commonService: CommonService
  ) {

  }

  SIZE_TO_MEDIA: any = {
    'xs': '(min-width: 0px)',
    'sm': '(min-width: 576px)',
    'md': '(min-width: 768px)',
    'lg': '(min-width: 992px)',
    'xl': '(min-width: 1200px)',
  };

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      let route = this.router.routerState.root;
      while (route.firstChild) route = route.firstChild;
      route.data.subscribe((data: any) => {
        this.pageTitle = data['title'];
      });
      this.selectedPageUrl = this.router.url;
    });
  }


  logout() {
    GoogleAuth.signOut();
    this.localStorageService.clearLocalStorage();
    this.commonService.goToRoute('');
  }

  deleteAccount(ev: any) {
    console.log(`Dismissed with role: ${ev.detail.role}`);
    if (ev.detail.role === 'confirm') {
      // this.loaderService.showLoader();
      let userEmail = this.localStorageService.getUserEmail()

      this.userService.deleteAccount(userEmail).subscribe({
        next: (r) => {
          GoogleAuth.signOut();
          this.localStorageService.clearLocalStorage();
          this.commonService.goToRoute('');
          this.toasterService.presentToast('Nalog uspesno obrisan', 'success');

        }, error: (err) => {
          // this.loaderService.hideLoader();
          this.toasterService.presentToast('Doslo je do greske', 'danger');
        }
      })
    }
  }

  toggleNav() {
    const splitPane = document.querySelector('ion-split-pane')
    const matchBreakpoint = (breakpoint: string | undefined) => {
      if (breakpoint === undefined || breakpoint === '') {
        return true;
      }
      if ((window as any).matchMedia) {
        const mediaQuery = this.SIZE_TO_MEDIA[breakpoint];
        return window.matchMedia(mediaQuery).matches;
      }
      return false;
    };
    if (matchBreakpoint('md')) {
      // @ts-ignore
      splitPane.classList.toggle('split-pane-visible')
    }
  }

}
