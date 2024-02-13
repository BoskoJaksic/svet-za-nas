import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login-register',
  templateUrl: './login-register.page.html',
  styleUrls: ['./login-register.page.scss'],
})
export class LoginRegisterPage implements OnInit {
  currentStep: number = 1;
  stepCompleted: boolean[] = [false, false, false];
  login = true;

  constructor() { }

  ngOnInit() {
  }
  onLoginChanged(loginStatus: boolean) {
    this.login = loginStatus;
  }

  goToLogin(){
    this.login = true;
  }
  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.stepCompleted[this.currentStep] = false;
    }
  }

  nextStep() {
    if (this.currentStep < 3) {
      this.currentStep++;
      this.markStepAsCompleted(this.currentStep - 1);
    }
  }

  markStepAsCompleted(step: number) {
    this.stepCompleted[step - 1] = true; // Step numbers are 1-based, arrays are 0-based
  }
}
