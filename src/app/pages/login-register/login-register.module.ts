import { NgModule } from '@angular/core';
import {CommonModule, DatePipe, NgOptimizedImage} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LoginRegisterPageRoutingModule } from './login-register-routing.module';

import { LoginRegisterPage } from './login-register.page';
import {CustomStepperComponent} from "../../components/custom-stepper/custom-stepper.component";
import {LoginComponent} from "../../components/login/login.component";
import {SharedModule} from "../../shared/shared.module";
import {Step1Component} from "../../components/custom-stepper/step1/step1.component";
import {Step2Component} from "../../components/custom-stepper/step2/step2.component";
import {Step3Component} from "../../components/custom-stepper/step3/step3.component";


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoginRegisterPageRoutingModule,
    SharedModule,
    NgOptimizedImage,
    ReactiveFormsModule,


  ],
  // providers: [
  //   DatePipe
  // ],
  declarations: [LoginRegisterPage,CustomStepperComponent, LoginComponent, Step1Component,Step2Component,Step3Component]
})
export class LoginRegisterPageModule {}
