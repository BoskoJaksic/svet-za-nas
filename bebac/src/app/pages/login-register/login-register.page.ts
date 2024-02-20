import {Component, OnInit, ViewChild} from '@angular/core';
import {Step1Component} from "../../components/custom-stepper/step1/step1.component";
import {ToasterService} from "../../common/services/toaster.service";
import {Step2Component} from "../../components/custom-stepper/step2/step2.component";
import {Step3Component} from "../../components/custom-stepper/step3/step3.component";
import {ComponentStepperSharedService} from "../../common/services/component-stepper-shared.service";

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

  constructor(private toasterService: ToasterService,
              private componentStepperSharedService: ComponentStepperSharedService
  ) {
  }

  ngOnInit() {
  }

  onLoginChanged(loginStatus: boolean) {
    this.login = loginStatus;
  }

  goToLogin() {
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
      //do register here
      const step1Data = this.componentStepperSharedService.step1Data;
      const step2Data = this.componentStepperSharedService.step2Data;
      const step3Data = this.componentStepperSharedService.step3Data;
      const dataToSend = {
        personalData: step1Data,
        children: step2Data,
        petData: step3Data
      }
      console.log(dataToSend)

    } else {
      this.toasterService.presentToast('Forma nije validna', 'warning')
    }
  }
}
