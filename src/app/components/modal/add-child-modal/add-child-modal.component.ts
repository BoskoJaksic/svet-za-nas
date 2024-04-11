import {Component, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {Child} from "../../../models/child.model";
import {Camera, CameraResultType} from "@capacitor/camera";
import {DatePipe} from "@angular/common";
import {LocalStorageService} from "../../../common/services/local-storage.service";
import {UserService} from "../../../common/services/user.service";
import {LoaderService} from "../../../common/services/loader.service";
import {ToasterService} from "../../../common/services/toaster.service";
import {CommonService} from "../../../common/services/common.service";

@Component({
  selector: 'app-add-child-modal',
  templateUrl: './add-child-modal.component.html',
  styleUrls: ['./add-child-modal.component.scss'],
})
export class AddChildModalComponent implements OnInit {
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

  constructor(private modalCtrl: ModalController,
              private localStorageService: LocalStorageService,
              private userService: UserService,
              private loaderService:LoaderService,
              public commonService:CommonService,
              private toasterService:ToasterService,
              private datePipe: DatePipe,) {
  }

  ngOnInit() {
  }

  takePicture = async () => {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl
    });
    this.profilePicture = image.dataUrl;
  };

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
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
    this.userService.addChild(dataToSend).subscribe({
      next: () => {
        this.modalCtrl.dismiss(true, 'confirm');
        this.loaderService.hideLoader()
      }, error: (err) => {
        this.loaderService.hideLoader()

      }
    })
  }

}
