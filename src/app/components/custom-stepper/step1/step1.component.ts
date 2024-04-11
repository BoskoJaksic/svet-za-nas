import {Component, OnInit} from '@angular/core';
import {Camera, CameraResultType} from "@capacitor/camera";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ComponentStepperSharedService} from "../../../common/services/component-stepper-shared.service";

@Component({
  selector: 'app-step1',
  templateUrl: './step1.component.html',
  styleUrls: ['./step1.component.scss'],
})
export class Step1Component implements OnInit {
  selectedImage: string | undefined = ''
  form: FormGroup;
  days: number[] = Array.from({length: 31}, (_, i) => i + 1);
  months: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  abbreviatedMonths: string[] = this.months.map(month => month.substring(0, 3));
  years: number[] = Array.from({length: 150}, (_, i) => 1920 + i);
  isPasswordVisible: boolean = false;

  constructor(public fb: FormBuilder, private componentStepperSharedService: ComponentStepperSharedService) {
    this.form = this.fb.group({
      fullName: ['', Validators.required],
      birthdateDay: [31, Validators.required],
      birthdateMonth: ['January', Validators.required],
      birthdateYear: [2024, Validators.required],
      parentRole: ['mom', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      profilePicture: ['']
    });
  }

  // passwordValidator(control: FormGroup) {
  //   const password = control.value;
  //   const hasUpperCase = /[A-Z]/.test(password);
  //   const hasLowerCase = /[a-z]/.test(password);
  //   const hasNumber = /\d/.test(password);
  //   const hasNonAlphanumeric = /[^\w\d]/.test(password);
  //
  //   const valid = hasUpperCase && hasLowerCase && hasNumber && hasNonAlphanumeric;
  //
  //   return valid ? null : {invalidPassword: true};
  // }

  ngOnInit() {
    const step1Data = this.componentStepperSharedService.step1Data;
    if (step1Data && Object.keys(step1Data).length > 0) {
      const formData: { [key: string]: any } = {};
      if (step1Data.fullName !== undefined) formData['fullName'] = step1Data.fullName;
      if (step1Data.birthdateDay !== undefined) formData['birthdateDay'] = step1Data.birthdateDay;
      if (step1Data.birthdateMonth !== undefined) formData['birthdateMonth'] = step1Data.birthdateMonth;
      if (step1Data.birthdateYear !== undefined) formData['birthdateYear'] = step1Data.birthdateYear;
      if (step1Data.parentRole !== undefined) formData['parentRole'] = step1Data.parentRole;
      if (step1Data.email !== undefined) formData['email'] = step1Data.email;
      if (step1Data.password !== undefined) formData['password'] = step1Data.password;
      if (step1Data.profilePicture !== undefined) formData['profilePicture'] = step1Data.profilePicture;

      this.form.patchValue(formData);
    }
  }

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  takePicture = async () => {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl
    });
    this.selectedImage = image.dataUrl
    if (image) {
      var fullBase64String =  image.dataUrl;
      // @ts-ignore
      var base64String = fullBase64String.replace(/^data:image\/\w+;base64,/, '');
      this.form.patchValue({profilePicture: base64String});
    } else {
      console.error('Nije odabrana slika.');
    }
  };

  isValid(): boolean {
    return this.form.valid;
  }
}
