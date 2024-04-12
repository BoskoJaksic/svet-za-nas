import {Component, OnInit, ViewChild} from '@angular/core';
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
import {IonModal, ModalController} from '@ionic/angular';
import {OverlayEventDetail} from "@ionic/core/components";
import {ChildService} from "../../../common/services/child.service";
import {ToasterService} from "../../../common/services/toaster.service";
import {DatePipe} from "@angular/common";
import {Camera, CameraResultType} from "@capacitor/camera";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  private firstLoad: boolean = true;
  private destroy$: Subject<boolean> = new Subject<boolean>();
  parent: any;
  otherParent: any;
  pet: any;
  @ViewChild(IonModal) modal!: IonModal;
  children: Child[] = [];
  days: number[] = Array.from({length: 31}, (_, i) => i + 1);
  months: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  abbreviatedMonths: string[] = this.months.map(month => month.substring(0, 3));
  years: number[] = Array.from({length: 150}, (_, i) => 1920 + i);
  birthDate = 31
  birthMonth = 'January'
  birthYear = 2024
  gender: any
  name: string = ''
  profilePicture: string | undefined = ''
  constructor(
    private router: Router,
    private userService: UserService,
    private loaderService: LoaderService,
    private toasterService: ToasterService,
    private datePipe: DatePipe,
    private childService: ChildService,
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

  takePicture = async () => {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl
    });
    this.profilePicture = image.dataUrl;
  };


  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
    }
  }

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  confirm() {
    if (!this.gender || !this.name){
      this.toasterService.presentToast('Forma nije validna','warning');
      return;
    }
    const date2 = new Date(`${(this.birthMonth)} ${this.birthDate}, ${this.birthYear}`);
    let dateOfBirth = this.datePipe.transform(date2, 'yyyy-MM-dd');
    // @ts-ignore
    let profilePicture = this.profilePicture.replace(/^data:image\/\w+;base64,/, '');

    const dataToSend = {
      email: this.localStorageService.getUserEmail(),
      name: this.name,
      dateOfBirth: dateOfBirth,
      profilePicture: profilePicture,
      gender: this.gender
    }
    this.loaderService.showLoader()
    this.childService.addChild(dataToSend).subscribe({
      next: () => {
        this.modalCtrl.dismiss(true, 'confirm');
        this.gender = null
        this.name  = ''
        this.profilePicture = ''
       this.loadData();
      }, error: (err) => {
        this.toasterService.presentToast('Došlo je do greške','warning');

      }
    })
  }
}
