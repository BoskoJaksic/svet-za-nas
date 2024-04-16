import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonModal, ModalController, NavController } from '@ionic/angular';
import { LoaderService } from '../../../../common/services/loader.service';
import { UserService } from '../../../../common/services/user.service';
import { LocalStorageService } from '../../../../common/services/local-storage.service';
import { Camera, CameraResultType } from '@capacitor/camera';
import { CommonService } from '../../../../common/services/common.service';
import { ToasterService } from '../../../../common/services/toaster.service';
import { ChildService } from '../../../../common/services/child.service';
import { OverlayEventDetail } from '@ionic/core/components';
import { Child } from '../../../../models/child.model';
import { DatePipe } from '@angular/common';
import { PetService } from 'src/app/common/services/pet.service';

@Component({
  selector: 'app-profile-details',
  templateUrl: './profile-details.page.html',
  styleUrls: ['./profile-details.page.scss'],
})
export class ProfileDetailsPage implements OnInit {
  receivedObject: any;
  age: number | null = null;
  message: string = '';
  newPicture: string | undefined;
  yearOld: any;
  monthsOld: any;
  weekPregnant: any;
  link = '';
  baseLInk = 'https://svetzanas.rs/';
  @ViewChild(IonModal) modal!: IonModal;
  children: Child[] = [];
  days: number[] = Array.from({ length: 31 }, (_, i) => i + 1);
  months: string[] = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  abbreviatedMonths: string[] = this.months.map((month) =>
    month.substring(0, 3)
  );
  years: number[] = Array.from({ length: 150 }, (_, i) => 1920 + i);
  birthDate = 31;
  birthMonth = 'January';
  birthYear = 2024;

  public alertButtons = [
    {
      text: 'Poništi',
      role: 'cancel',
      handler: () => {
        console.log('Alert canceled');
      },
    },
    {
      text: 'Obriši',
      role: 'confirm',
      handler: () => {
        console.log('Alert confirmed');
      },
    },
  ];

  constructor(
    private route: ActivatedRoute,
    private loaderService: LoaderService,
    private localStorageService: LocalStorageService,
    private userService: UserService,
    public commonService: CommonService,
    private modalCtrl: ModalController,
    private childService: ChildService,
    private petService: PetService,
    private toasterService: ToasterService,
    private router: Router,
    private datePipe: DatePipe,
    private navController: NavController
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.loaderService.showLoader();
      this.yearOld = 0;
      this.monthsOld = 0;
      this.weekPregnant = 0;
      const encodedObject = params['data'];
      setTimeout(() => {
        this.loaderService.hideLoader();
      }, 100);
      this.receivedObject = JSON.parse(decodeURIComponent(encodedObject));
      console.log('received', this.receivedObject);
      const dobDate = new Date(this.receivedObject.dateOfBirth);
      const year = dobDate.getFullYear();
      const month = dobDate.getMonth() + 1; // Adding 1 because getMonth() returns 0-based index
      const day = dobDate.getDate();
      this.birthDate = day;
      this.birthYear = year;
      const numericMonth = month;
      const monthName = this.months[numericMonth - 1];
      this.birthMonth = monthName;
      this.calculateAgeOrPregnancy(this.receivedObject.dateOfBirth);
    });
  }

  takePicture = async () => {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
    });
    if (image.dataUrl) {
      this.newPicture = image.dataUrl;
      this.changeUserImg();
    }
  };

  getEmailToSend() {
    if (this.receivedObject.parentRole) {
      return this.receivedObject.email;
    } else {
      return this.localStorageService.getUserEmail();
    }
  }

  changeUserImg() {
    // @ts-ignore parentRole
    const profilePicture = this.newPicture.replace(
      /^data:image\/\w+;base64,/,
      ''
    );
    const dataToSend = {
      email: this.getEmailToSend(),
      name: this.receivedObject.name,
      profilePicture: profilePicture,
      person: this.receivedObject.pets
        ? 2
        : this.receivedObject.parentRole
        ? 0
        : 1,
    };
    this.userService.changeUserImg(dataToSend).subscribe({
      next(r) {},
      error(err) {
        console.log('error while updating profile picture', err);
      },
    });
  }

  private calculateAgeOrPregnancy(dateString: string): void {
    const givenDate = new Date(dateString);
    const currentDate = new Date();
    const oneDay = 24 * 60 * 60 * 1000;
    const oneWeek = 7 * oneDay;

    if (givenDate > currentDate) {
      const daysUntilDueDate = Math.floor(
        (givenDate.getTime() - currentDate.getTime()) / oneDay
      );
      const weeksUntilDueDate = Math.floor(daysUntilDueDate / 7);
      const weeksPregnant = 40 - weeksUntilDueDate;
      this.message = `${weeksPregnant} nedelja trudnaoce`;
      this.weekPregnant = weeksPregnant;
    } else {
      const monthsOld = Math.floor(
        (currentDate.getTime() - givenDate.getTime()) / (30 * oneDay)
      );
      if (monthsOld <= 36) {
        this.message = `${monthsOld} meseci`;
        this.monthsOld = monthsOld;
      } else {
        let ageYears = currentDate.getFullYear() - givenDate.getFullYear();
        if (
          currentDate.getMonth() < givenDate.getMonth() ||
          (currentDate.getMonth() == givenDate.getMonth() &&
            currentDate.getDate() < givenDate.getDate())
        ) {
          ageYears--;
        }
        this.message = `${ageYears} godina`;
        this.yearOld = ageYears;
      }
    }
  }

  async generateLink() {
    if (this.weekPregnant && this.weekPregnant > 0) {
      this.link = `${this.baseLInk}trudnoca/`;
    } else {
      if (this.monthsOld && this.monthsOld <= 36) {
        if (this.monthsOld >= 0 && this.monthsOld <= 3) {
          this.link = `${this.baseLInk}razvojna-mapa/razvoj-bebe-0-3-meseca/`;
        } else if (this.monthsOld >= 4 && this.monthsOld <= 6) {
          this.link = `${this.baseLInk}razvojna-mapa/razvojna-mapa-4-6-meseci/`;
        } else if (this.monthsOld >= 7 && this.monthsOld <= 9) {
          this.link = `${this.baseLInk}razvojna-mapa/razvojna-mapa-7-9-meseci/`;
        } else if (this.monthsOld >= 10 && this.monthsOld <= 12) {
          this.link = `${this.baseLInk}razvojna-mapa/razvojna-mapa-10-12-meseci/`;
        } else if (this.monthsOld >= 13 && this.monthsOld <= 18) {
          this.link = `${this.baseLInk}razvojna-mapa/razvojna-mapa-13-18-meseci/`;
        } else if (this.monthsOld >= 19 && this.monthsOld <= 24) {
          this.link = `${this.baseLInk}razvojna-mapa/razvojna-mapa-19-24-meseca/`;
        } else if (this.monthsOld >= 25 && this.monthsOld <= 36) {
          this.link = `${this.baseLInk}razvojna-mapa/razvojna-mapa-25-36-meseci/`;
        } else {
          this.link = this.baseLInk;
        }
      } else {
        if (this.yearOld >= 3 && this.yearOld <= 4) {
          this.link = `${this.baseLInk}razvojna-mapa/razvojna-mapa-3-4-godine/`;
        } else if (this.yearOld >= 4 && this.yearOld <= 5) {
          this.link = `${this.baseLInk}razvojna-mapa/razvojna-mapa-4-5-godina/`;
        } else if (this.yearOld >= 5 && this.yearOld <= 6) {
          this.link = `${this.baseLInk}razvojna-mapa/razvojna-mapa-5-6-godina/`;
        } else if (this.yearOld >= 6 && this.yearOld <= 7) {
          this.link = `${this.baseLInk}razvojna-mapa/razvojna-mapa-6-7-godina/`;
        } else {
          this.link = this.baseLInk;
        }
      }
    }
    const queryParams = encodeURIComponent(JSON.stringify(this.link));
    await this.router.navigate(['home/in-app-browser'], {
      queryParams: { data: queryParams },
    });
  }

  isFutureDate(dateOfBirth: any): boolean {
    const currentDate = new Date();
    const targetDate = new Date(dateOfBirth);
    return targetDate > currentDate;
  }

  generateImg() {
    if (this.receivedObject?.profilePicture) {
      return this.receivedObject.profilePicture;
    } else {
      if (this.receivedObject?.parentRole) {
        if (this.receivedObject?.parentRole === 'mom') {
          return './assets/images/mom.png';
        } else {
          return '/assets/images/dad.png';
        }
      } else if (this.receivedObject.gender) {
        if (this.isFutureDate(this.receivedObject.dateOfBirth)) {
          return '/assets/images/baby.png';
        } else {
          if (this.receivedObject.gender === 'boy') {
            return '/assets/images/boy.png';
          } else if (this.receivedObject.gender === 'girl') {
            return '/assets/images/girl.png';
          } else {
            return '/assets/images/baby.png';
          }
        }
      } else {
        return '/assets/images/pet.png';
      }
    }
  }

  deleteEntity(event: any) {
    if (this.receivedObject.children) this.deleteChild(event);
    if (this.receivedObject.pets) this.deletePet(event);
    if (this.receivedObject.otherParent) this.deleteOtherParent(event);
  }

  deleteChild(event: any) {
    if (event.detail.role === 'confirm') {
      this.loaderService.showLoader();
      let dataToSend = {
        parentId: this.localStorageService.getUserId(),
        childId: this.receivedObject.childId,
      };
      this.childService.deleteChild(dataToSend).subscribe(
        (r) => {
          this.toasterService.presentToast(
            'Podaci uspešno obrisani',
            'success'
          );
          this.navController.navigateBack('home/profile');
        },
        (error) => {
          this.toasterService.presentToast(
            'Greška prilikom brisanja',
            'danger'
          );
          this.loaderService.hideLoader();
          console.log(error);
        }
      );
    }
  }

  deletePet(event: any) {
    if (event.detail.role === 'confirm') {
      this.loaderService.showLoader();
      let dataToSend = {
        parentId: this.localStorageService.getUserId(),
        petId: this.receivedObject.petId,
      };
      this.petService.deletePet(dataToSend).subscribe(
        (r) => {
          this.toasterService.presentToast(
            'Podaci uspešno obrisani',
            'success'
          );
          this.navController.navigateBack('home/profile');
        },
        (error) => {
          this.toasterService.presentToast(
            'Greška prilikom brisanja',
            'danger'
          );
          this.loaderService.hideLoader();
          console.log(error);
        }
      );
    }
  }

  deleteOtherParent(event: any) {
    if (event.detail.role === 'confirm') {
      this.loaderService.showLoader();
      this.userService
        .deleteOtherParent(this.localStorageService.getUserId())
        .subscribe(
          (r) => {
            this.toasterService.presentToast(
              'Podaci uspešno obrisani',
              'success'
            );
            this.navController.navigateBack('home/profile');
          },
          (error) => {
            this.toasterService.presentToast(
              'Greška prilikom brisanja',
              'danger'
            );
            this.loaderService.hideLoader();
            console.log(error);
          }
        );
    }
  }

  changeName() {
    const dataToSend = {
      parentId: this.localStorageService.getUserId(),
      fullName: this.receivedObject.name,
    };

    this.userService.updateUser(dataToSend).subscribe({
      next: () => {
        this.modalCtrl.dismiss(true, 'confirm');
        this.toasterService.presentToast('Uspešno ažurirani podaci', 'success');
      },
      error: (err) => {
        this.toasterService.presentToast('Došlo je do greške', 'danger');
      },
    });
  }

  cancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    const date2 = new Date(
      `${this.birthMonth} ${this.birthDate}, ${this.birthYear}`
    );
    let dateOfBirth: string | null = this.datePipe.transform(
      date2,
      'yyyy-MM-dd'
    );
    const dataToSend = {
      parentId: this.localStorageService.getUserId(),
      dateOfBirth: dateOfBirth,
      childName: this.receivedObject.name,
    };
    this.childService.editChild(dataToSend).subscribe({
      next: () => {
        this.modalCtrl.dismiss(true, 'confirm');
        this.receivedObject.dateOfBirth = dateOfBirth;
        // @ts-ignore
        this.calculateAgeOrPregnancy(dateOfBirth);
        this.toasterService.presentToast('Uspešno ažurirani podaci', 'success');
      },
      error: (err) => {
        this.toasterService.presentToast('Došlo je do greške', 'danger');
      },
    });
  }

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
    }
  }

  goBack() {
    this.navController.navigateBack('home/profile');
  }
}
