import { Component, OnInit } from '@angular/core';
import { filter, Subject, takeUntil } from 'rxjs';
import {
  ActivatedRoute,
  Event as NavigationEvent,
  NavigationEnd,
  Router,
} from '@angular/router';
import { UserService } from '../../../common/services/user.service';
import { LocalStorageService } from '../../../common/services/local-storage.service';
import { Child } from '../../../models/child.model';
import { LoaderService } from '../../../common/services/loader.service';
import { ModalController } from '@ionic/angular';
import { AddChildModalComponent } from '../../../components/modal/add-child-modal/add-child-modal.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  private firstLoad: boolean = true;
  private destroy$: Subject<boolean> = new Subject<boolean>();
  children: Child[] = [];
  parent: any;
  otherParent: any;
  pet: any;

  constructor(
    private router: Router,
    private userService: UserService,
    private loaderService: LoaderService,
    private localStorageService: LocalStorageService,
    private modalCtrl: ModalController,
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
        if (event.urlAfterRedirects.includes('/profile')) {
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

  loadData() {
    this.loaderService.showLoader();
    const userEmail = this.localStorageService.getUserEmail();
    this.userService.getUserDataByEmail(userEmail).subscribe({
      next: (r) => {
        this.localStorageService.setUserId(r.id);
        this.children = r.children;
        this.parent = {
          name: r.fullName,
          profilePicture: r.profilePicture,
          dateOfBirth: r.dateOfBirth,
          parentRole: r.parentRole,
          email: r.email,
        };
        if (r.otherParent) {
          this.otherParent = {
            name: r.otherParent.fullName,
            profilePicture: r.otherParent.profilePicture,
            dateOfBirth: r.otherParent.dateOfBirth,
            parentRole: r.otherParent.parentRole,
            email: r.otherParent.email,
          };
        }

        if (r.pets?.length > 0) {
          this.pet = {
            name: r.pets[0]?.petName,
            profilePicture: r.pets[0].profilePicture,
            dateOfBirth: r.pets[0].dateOfBirth,
            pets: true,
          };
        }

        this.loaderService.hideLoader();
      },
      error: (err) => {
        console.log('err', err);
        this.loaderService.hideLoader();
      },
    });
  }

  async openModal() {
    const modal = await this.modalCtrl.create({
      component: AddChildModalComponent,
      mode: 'ios',
    });
    await modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      if (data) {
        this.loadData();
      }
    }
  }
}
