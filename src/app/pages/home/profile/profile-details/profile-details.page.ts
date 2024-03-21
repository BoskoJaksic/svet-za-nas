import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {NavController} from "@ionic/angular";
import {LoaderService} from "../../../../common/services/loader.service";
import {UserService} from "../../../../common/services/user.service";
import {LocalStorageService} from "../../../../common/services/local-storage.service";
import {Camera, CameraResultType} from "@capacitor/camera";

@Component({
  selector: 'app-profile-details',
  templateUrl: './profile-details.page.html',
  styleUrls: ['./profile-details.page.scss'],
})
export class ProfileDetailsPage implements OnInit {
  receivedObject: any;
  age: number | null = null;
  message: string = '';
  newPicture:string | undefined

  constructor(private route: ActivatedRoute,
              private loaderService: LoaderService,
              private localStorageService: LocalStorageService,
              private userService: UserService,
              private navController: NavController
  ) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.loaderService.showLoader();
      const encodedObject = params['data'];
      setTimeout(() => {
        this.loaderService.hideLoader();
      }, 100)
      this.receivedObject = JSON.parse(decodeURIComponent(encodedObject));
      this.calculateAgeOrPregnancy(this.receivedObject.dateOfBirth);
      console.log('received', this.receivedObject)
    });
  }

  takePicture = async () => {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl
    });
    if (image.dataUrl){
      this.newPicture = image.dataUrl;
      this.changeUserImg();
    }
  };
  changeUserImg() {
   // @ts-ignore parentRole
    const profilePicture =  this.newPicture.replace(/^data:image\/\w+;base64,/, '');
    const dataToSend  = {
      email:this.localStorageService.getUserEmail(),
      name:this.receivedObject.name,
      profilePicture:profilePicture,
      person: this.receivedObject.pets ? 2 : (this.receivedObject.parentRole ? 0 : 1)
    }
    this.userService.changeUserImg(dataToSend).subscribe({
      next(r) {

      }, error(err) {
        console.log('error while updating profile picture',err)
      }
    })
    console.log('received obj', this.receivedObject)
  }

  // calculateYears() {
  //   const today = new Date();
  //   const dobParts = this.receivedObject.dateOfBirth.split('-');
  //   const dateOfBirth = new Date(+dobParts[0], dobParts[1] - 1, +dobParts[2]);
  //
  //   let noOfYears = today.getFullYear() - dateOfBirth.getFullYear();
  //
  //   // Check if the birthday for this year has passed
  //   if (today.getMonth() < dateOfBirth.getMonth() ||
  //     (today.getMonth() === dateOfBirth.getMonth() && today.getDate() < dateOfBirth.getDate())) {
  //     noOfYears--;
  //   }
  //   return noOfYears;
  // }

  private calculateAgeOrPregnancy(dateString: string): void {
    const givenDate = new Date(dateString);
    const currentDate = new Date();
    const oneDay = 24 * 60 * 60 * 1000;
    const oneWeek = 7 * oneDay;
    const oneMonth = 30 * oneDay; // Aproksimacija

    if (givenDate > currentDate) {
      // Datum je u budućnosti, izračunavamo broj nedelja trudnoće
      const weeksPregnant = Math.floor((givenDate.getTime() - currentDate.getTime()) / oneWeek);
      this.message = `${weeksPregnant} nedelja trudnaoce`;
    } else {
      // Izračunavamo starost u mesecima ako je osoba mlađa od godinu dana
      const monthsOld = Math.floor((currentDate.getTime() - givenDate.getTime()) / oneMonth);
      if (monthsOld < 12) {
        this.message = `${monthsOld} meseci`;
      } else {
        // Izračunavamo starost u godinama ako je osoba starija od godinu dana
        const ageYears = currentDate.getFullYear() - givenDate.getFullYear();
        this.message = `${ageYears} godina`;
      }
    }
  }


  goBack() {
    this.navController.navigateBack('home/profile')
  }
}
