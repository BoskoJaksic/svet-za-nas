import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Camera, CameraResultType} from "@capacitor/camera";
import {ComponentStepperSharedService} from "../../../common/services/component-stepper-shared.service";

@Component({
  selector: 'app-step3',
  templateUrl: './step3.component.html',
  styleUrls: ['./step3.component.scss'],
})
export class Step3Component implements OnInit {
  form: FormGroup;
  selectedImage: string | undefined = ''
  days: number[] = Array.from({length: 31}, (_, i) => i + 1);
  months: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  abbreviatedMonths: string[] = this.months.map(month => month.substring(0, 3));
  years: number[] = Array.from({length: 51}, (_, i) => 1990 + i);
  addPet = false

  constructor(public fb: FormBuilder, private componentStepperSharedService: ComponentStepperSharedService) {
    this.form = this.fb.group({
      petName: ['', Validators.required],
      birthdateDay: [31, Validators.required],
      birthdateMonth: ['January', Validators.required],
      birthdateYear: [2024, Validators.required],
      role: [''],
      elsePet: [''],
      image: ['']
    });
  }

  private setValidators() {
    this.form.get('petName')!.setValidators(Validators.required);
    this.form.get('birthdateDay')!.setValidators(Validators.required);
    this.form.get('birthdateMonth')!.setValidators(Validators.required);
    this.form.get('birthdateYear')!.setValidators(Validators.required);
  }

  private clearValidators() {
    this.form.get('petName')!.clearValidators();
    this.form.get('birthdateDay')!.clearValidators();
    this.form.get('birthdateMonth')!.clearValidators();
    this.form.get('birthdateYear')!.clearValidators();
  }

  ngOnInit() {
    const step3Data = this.componentStepperSharedService.step3Data;
    if (step3Data && Object.keys(step3Data).length > 0) {
      const formData: { [key: string]: any } = {};
      if (step3Data.petName !== undefined) formData['petName'] = step3Data.petName;
      if (step3Data.birthdateDay !== undefined) formData['birthdateDay'] = step3Data.birthdateDay;
      if (step3Data.birthdateMonth !== undefined) formData['birthdateMonth'] = step3Data.birthdateMonth;
      if (step3Data.birthdateYear !== undefined) formData['birthdateYear'] = step3Data.birthdateYear;
      if (step3Data.role !== undefined) formData['role'] = step3Data.role;
      if (step3Data.elsePet !== undefined) formData['elsePet'] = step3Data.elsePet;
      if (step3Data.image !== undefined) formData['image'] = step3Data.image;
      this.addPet = true;
      this.form.patchValue(formData);
    } else {
      this.form.disable();
      this.clearValidators();
      this.form.patchValue({
        birthdateDay: 31
      });
      this.form.patchValue({
        birthdateMonth: 'January'
      });
      this.form.patchValue({
        birthdateYear: 2024
      });
    }

  }

  onChangeAddPet() {
    if (this.addPet) {
      this.form.enable();
      this.setValidators()
    } else {
      this.form.disable();
      this.clearValidators();
      this.form.reset();
    }
  }

  takePicture = async () => {
    if (!this.addPet) {
      return;
    }
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl
    });
    this.selectedImage = image.dataUrl
    if (image) {
      this.form.patchValue({image: 'data:image/jpeg;base64,' + image.dataUrl});
      console.log(this.form)
    } else {
      console.error('Nije odabrana slika.');
    }
  };

  isValid(): boolean {
    if (!this.addPet) {
      return true;
    }
    if (this.form.value.petName === "") {
      return false;
    }

    if (this.form.value.role === '') {
      if (this.form.value.elsePet === '') {
        return false
      }
    }
    return true;
  }

  petChoose() {
    this.form.patchValue({
      role: ''
    });
  }
}
