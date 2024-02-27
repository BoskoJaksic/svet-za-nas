import {Component, OnInit} from '@angular/core';
import {filter, Subject, takeUntil} from "rxjs";
import {ActivatedRoute, Event as NavigationEvent, NavigationEnd, Router} from "@angular/router";
import {UserService} from "../../../common/services/user.service";
import {LocalStorageService} from "../../../common/services/local-storage.service";
import {Child} from "../../../models/child.model";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  private firstLoad: boolean = true;
  private destroy$: Subject<boolean> = new Subject<boolean>();
  children: Child[] = []

  constructor(private router: Router,
              private userService: UserService,
              private localStorageService: LocalStorageService,
              private activatedRoute: ActivatedRoute) {
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
    const userEmail = this.localStorageService.getUserEmail();
    this.userService.getUserDataByEmail(userEmail).subscribe({
      next: (r) => {
        this.children = r.value.children
        console.log('get user', r)
      }, error: (err) => {
        console.log('err', err)
      }
    })
    console.log('loaded')
  }
}
