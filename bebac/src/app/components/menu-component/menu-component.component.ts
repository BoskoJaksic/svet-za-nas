import {Component, Input, OnInit} from '@angular/core';
import {filter} from "rxjs";
import {NavigationEnd, Router} from "@angular/router";
import {CommonService} from "../../common/services/common.service";

@Component({
  selector: 'app-menu-component',
  templateUrl: './menu-component.component.html',
  styleUrls: ['./menu-component.component.scss'],
})
export class MenuComponentComponent implements OnInit {


  pageTitle: string = '';
  @Input() sidebarsUrl: any;
  selectedPageUrl: string = '';

  constructor(private router: Router,
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
    this.commonService.goToRoute('');
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
