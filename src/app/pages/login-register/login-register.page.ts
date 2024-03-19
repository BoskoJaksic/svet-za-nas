import {Component, OnInit, ViewChild} from '@angular/core';
import {Step1Component} from "../../components/custom-stepper/step1/step1.component";
import {ToasterService} from "../../common/services/toaster.service";
import {Step2Component} from "../../components/custom-stepper/step2/step2.component";
import {Step3Component} from "../../components/custom-stepper/step3/step3.component";
import {ComponentStepperSharedService} from "../../common/services/component-stepper-shared.service";
import {RegisterService} from "../../common/services/login-register/register.service";
import {DatePipe} from "@angular/common";
import {CommonService} from "../../common/services/common.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-login-register',
  templateUrl: './login-register.page.html',
  styleUrls: ['./login-register.page.scss'],
})
export class LoginRegisterPage implements OnInit {
  @ViewChild(Step1Component) step1Component!: Step1Component;
  @ViewChild(Step2Component) step2Component!: Step2Component;
  @ViewChild(Step3Component) step3Component!: Step3Component;

  currentStep: number = 1;
  stepCompleted: boolean[] = [false, false, false];
  login = true;
  registerSpinner: boolean = false;
  errMessage: string = '';
  showRegisterPartner: boolean = false

  constructor(private toasterService: ToasterService,
              private componentStepperSharedService: ComponentStepperSharedService,
              private registerService: RegisterService,
              private commonService: CommonService,
              private route: ActivatedRoute,
              private datePipe: DatePipe,
  ) {
  }

  ngOnInit() {
    this.route.params.subscribe(async params => {
      const paramId = params['id'];
      this.showRegisterPartner = paramId === 'true';

    })
  }

  onLoginChanged(loginStatus: boolean) {
    this.login = loginStatus;
  }

  goToLogin() {
    this.resetFormValues();
    this.login = true;
  }

  prevStep() {
    if (this.currentStep === 3) {
      this.componentStepperSharedService.step3Data = this.step3Component.form.value

    }
    if (this.currentStep > 1) {
      this.currentStep--;
      this.stepCompleted[this.currentStep] = false;
    }
  }

  checkFormValidity(register: boolean) {
    if (this.currentStep === 1) {
      if (!register) {
        this.componentStepperSharedService.step1Data = this.step1Component.form.value
      }
      return this.step1Component && this.step1Component.isValid();
    } else if (this.currentStep === 2) {
      if (!register) {
        this.componentStepperSharedService.step2Data = this.step2Component.children
      }
      return this.step2Component && this.step2Component.isValid();
    } else if (this.currentStep === 3) {
      this.componentStepperSharedService.step3Data = this.step3Component.form.value
      return this.step3Component && this.step3Component.isValid();
    }
    return true;
  }

  nextStep() {
    if (this.checkFormValidity(false)) {
      this.currentStep++;
      this.markStepAsCompleted(this.currentStep - 1);
    } else {
      this.toasterService.presentToast('Forma nije validna', 'warning')
    }
  }

  markStepAsCompleted(step: number) {
    this.stepCompleted[step - 1] = true;
  }

  register() {
    if (this.checkFormValidity(true)) {
      this.registerSpinner = true;
      //do register here
      const step1Data = this.componentStepperSharedService.step1Data;
      const step2Data = this.componentStepperSharedService.step2Data;
      const step3Data = this.componentStepperSharedService.step3Data;
      const date1 = new Date(`${step1Data.birthdateMonth} ${step1Data.birthdateDay}, ${step1Data.birthdateYear}`);
      step1Data.dateOfBirth = this.datePipe.transform(date1, 'yyyy-MM-dd');
      if (step3Data && step3Data.role) {
        const date3 = new Date(`${step3Data.birthdateMonth} ${step3Data.birthdateDay}, ${step3Data.birthdateYear}`);
        step3Data.dateOfBirth = this.datePipe.transform(date3, 'yyyy-MM-dd');
      }


      for (const child of step2Data) {
        const date2 = new Date(`${child.birthMonth} ${child.birthDate}, ${child.birthYear}`);
        child.dateOfBirth = this.datePipe.transform(date2, 'yyyy-MM-dd');
        child.profilePicture = child.profilePicture.replace(/^data:image\/\w+;base64,/, '');
      }
      const dataToSend = {
        fullName: step1Data.fullName,
        email: step1Data.email,
        password: step1Data.password,
        dateOfBirth: step1Data.dateOfBirth,
        profilePicture: step1Data.profilePicture,
        parentRole: step1Data.parentRole,
        children: step2Data,
        pets:
          [step3Data]
      }
      if (step3Data.role === '' || step3Data.role === null){
        dataToSend.pets = []
      }
      console.log(dataToSend)
      this.registerService.registerUser(dataToSend).subscribe({
        next: (r) => {
          console.log('r', r)
          this.resetFormValues();
          this.toasterService.presentToast('Registracija uspesna', 'success');
          this.registerSpinner = false;
          this.login = true;
        }, error: (err) => {
          console.log('err', err)
          this.registerSpinner = false;
          this.errMessage = err.message
        }
      })

    } else {
      this.toasterService.presentToast('Forma nije validna', 'warning')
    }
  }

  resetFormValues(){
    this.stepCompleted[3] = false;
    this.stepCompleted[2] = false;
    this.stepCompleted[1] = false;
    this.currentStep = 1;
    this.componentStepperSharedService.step1Data = null;
    this.componentStepperSharedService.step2Data = null;
    this.componentStepperSharedService.step3Data = null;
  }
}
