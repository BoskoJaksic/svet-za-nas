import {Component, OnInit} from '@angular/core';
import {filter, Subject, takeUntil} from "rxjs";
import {ActivatedRoute, Event as NavigationEvent, NavigationEnd, Router} from "@angular/router";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  private firstLoad: boolean = true;
  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.router.events.pipe(
      filter((event: NavigationEvent): event is NavigationEnd => event instanceof NavigationEnd),
      takeUntil(this.destroy$)
    ).subscribe((event: NavigationEnd) => {
      if (event.urlAfterRedirects.includes('/profile')) {
        const hasQueryParam = this.activatedRoute.snapshot.queryParamMap.has('hasData');
        if (this.firstLoad) {
          this.firstLoad = false;
        } else {
          if (!hasQueryParam) {
            this.loadData();
          }
        }
      }
    });
    const hasQueryParam = this.activatedRoute.snapshot.queryParamMap.has('hasData');
    if (!hasQueryParam) {
      this.loadData();
    }
  }

  loadData() {
    console.log('loaded')
  }
}
