import { Component, NgZone, OnInit } from '@angular/core';
import { filter, Subject, takeUntil } from 'rxjs';
import {
  ActivatedRoute,
  Event as NavigationEvent,
  NavigationEnd,
  Router,
} from '@angular/router';
import { Browser } from '@capacitor/browser';
import { CommonService } from '../../../common/services/common.service';
import { UserService } from '../../../common/services/user.service';
import { LocalStorageService } from '../../../common/services/local-storage.service';
import { LoaderService } from '../../../common/services/loader.service';

@Component({
  selector: 'app-in-app-browser',
  templateUrl: './in-app-browser.page.html',
  styleUrls: ['./in-app-browser.page.scss'],
})
export class InAppBrowserPage implements OnInit {
  private firstLoad: boolean = true;
  private destroy$: Subject<boolean> = new Subject<boolean>();
  children: any;
  link: string = '';
  baseLInk = 'http://playm61.sg-host.com/wp-admin/';

  constructor(
    private router: Router,
    private ngZone: NgZone,
    private commonService: CommonService,
    private loaderService: LoaderService,
    private localStorageService: LocalStorageService,
    private userService: UserService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.router.events
      .pipe(
        filter(
          (event: NavigationEvent): event is NavigationEnd =>
            event instanceof NavigationEnd
        ),
        takeUntil(this.destroy$)
      )
      .subscribe((event: NavigationEnd) => {
        if (event.urlAfterRedirects.includes('/in-app-browser')) {
          const hasQueryParam =
            this.activatedRoute.snapshot.queryParamMap.has('hasData');
          if (this.firstLoad) {
            this.firstLoad = false;
          } else {
            if (!hasQueryParam) {
              this.loadData();
            }
          }
        }
      });
    const hasQueryParam =
      this.activatedRoute.snapshot.queryParamMap.has('hasData');
    if (!hasQueryParam) {
      this.loadData();
    }
  }

  generateLink(
    isPregnant: boolean,
    isMonth?: boolean,
    isYear?: boolean,
    date?: any
  ) {
    if (isPregnant) {
      this.link = `${this.baseLInk}trudnoca/`;
    } else {
      if (isMonth) {
        if (date >= 0 && date <= 3) {
          this.link = `${this.baseLInk}razvojna-mapa-0-3-meseca/`;
        } else if (date >= 4 && date <= 6) {
          this.link = `${this.baseLInk}razvojna-mapa-4-6-meseci/`;
        } else if (date >= 7 && date <= 9) {
          this.link = `${this.baseLInk}razvojna-mapa-7-9-meseci/`;
        } else if (date >= 10 && date <= 12) {
          this.link = `${this.baseLInk}razvojna-mapa-10-12-meseci/`;
        } else if (date >= 13 && date <= 18) {
          this.link = `${this.baseLInk}razvojna-mapa-13-18-meseci/`;
        } else if (date >= 19 && date <= 24) {
          this.link = `${this.baseLInk}razvojna-mapa-19-24-meseca/`;
        } else if (date >= 25 && date <= 36) {
          this.link = `${this.baseLInk}razvojna-mapa-25-36-meseci/`;
        } else {
          this.link = '';
        }
      }
      if (isYear) {
        if (date >= 3 && date <= 4) {
          this.link = `${this.baseLInk}razvojna-mapa-3-4-godine/`;
        } else if (date >= 4 && date <= 5) {
          this.link = `${this.baseLInk}razvojna-mapa-4-5-godina/`;
        } else if (date >= 5 && date <= 6) {
          this.link = `${this.baseLInk}razvojna-mapa-5-6-godina/`;
        } else if (date >= 6 && date <= 7) {
          this.link = `${this.baseLInk}razvojna-mapa-6-7-godina/`;
        } else {
          this.link = '';
        }
      }
    }
    this.openBrowserPage(this.link);
  }

  calculateBabyYears() {
    var todayDate = new Date();
    var youngestDate = new Date(this.children[0].dateOfBirth);

    for (var i = 1; i < this.children.length; i++) {
      var currentDateOfBirth = new Date(this.children[i].dateOfBirth);
      if (currentDateOfBirth > youngestDate) {
        youngestDate = currentDateOfBirth;
      }
    }

    var diff = todayDate.getTime() - youngestDate.getTime();

    var yearDiff = diff / (1000 * 3600 * 24 * 365.25);
    var monthDiff = diff / (1000 * 3600 * 24 * 30);

    if (monthDiff <= 36) {
      var mmm = Math.floor(monthDiff);
      this.generateLink(false, true, false, mmm);
    } else {
      var yyy = Math.floor(yearDiff);
      this.generateLink(false, false, true, yyy);
    }
  }

  isPregnant() {
    var todayDate = new Date();
    for (var i = 0; i < this.children.length; i++) {
      var dateToCheck = new Date(this.children[i].dateOfBirth);
      if (dateToCheck > todayDate) {
        return true;
      }
    }
    return false;
  }

  async openBrowserPage(link: string) {
    await Browser.open({ url: link });
    this.commonService.goToRoute('home/profile');
  }

  loadData() {
    Browser.addListener('browserFinished', () => {
      this.ngZone.run(() => {
        this.commonService.goToRoute('home/profile');
      });
    });
    this.getChildren();
  }

  getChildren() {
    this.loaderService.showLoader();
    const userEmail = this.localStorageService.getUserEmail();
    this.userService.getUserDataByEmail(userEmail).subscribe({
      next: (r) => {
        this.children = r.children;
        if (this.isPregnant()) {
          this.generateLink(true);
        } else {
          this.calculateBabyYears();
        }
        this.loaderService.hideLoader();
      },
      error: (err) => {
        console.log('err', err);
        this.loaderService.hideLoader();
      },
    });
  }

  // ionRefreshPage(event: any) {
  //   setTimeout(async () => {
  //     await Browser.open({url: 'https://wedosoftware.eu/svet-za-nas/razvojna-mapa-4-6-meseci/'});
  //     event.target.complete();
  //   }, 2000);
  // }
}
