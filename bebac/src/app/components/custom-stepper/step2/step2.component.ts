import { Component, OnInit } from '@angular/core';
import {Camera, CameraResultType} from "@capacitor/camera";
import {Child} from "../../../models/child.model";
import {ComponentStepperSharedService} from "../../../common/services/component-stepper-shared.service";

@Component({
  selector: 'app-step2',
  templateUrl: './step2.component.html',
  styleUrls: ['./step2.component.scss'],
})
export class Step2Component  implements OnInit {
  children: Child[] = [];
  days: number[] = Array.from({length: 31}, (_, i) => i + 1);
  months: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  abbreviatedMonths: string[] = this.months.map(month => month.substring(0, 3));
  years: number[] = Array.from({length: 51}, (_, i) => 1990 + i);

  constructor(private componentStepperSharedService:ComponentStepperSharedService) {

  }
  takePicture = async (index:number) => {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl
    });
    this.children[index].photo = image.dataUrl;
  };
  ngOnInit() {
    this.addChild();
    const step2Data = this.componentStepperSharedService.step2Data;
    if (step2Data && Object.keys(step2Data).length > 0) {
      this.children = step2Data
    }
  }

  addChild() {
    console.log(this.children);
    this.children.push({
      birthDate: 31,
      birthMonth: 'January',
      birthYear: 2024,
      gender: '',
      name: '',
      photo: ''
    });
  }

  isValid(): boolean {
    for (const child of this.children) {
      if (!child.gender.trim() || !child.name.trim()) {
        return false;
      }
    }
    return true;
  }
}
