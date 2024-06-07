import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';

import { ForgotPasswordRoutingModule } from './forgot-password-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from 'src/app/shared/shared.module';
import { LoginRegisterPageRoutingModule } from '../login-register/login-register-routing.module';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

@NgModule({
  declarations: [ForgotPasswordComponent, ResetPasswordComponent],
  imports: [
    ForgotPasswordRoutingModule,
    CommonModule,
    FormsModule,
    IonicModule,
    LoginRegisterPageRoutingModule,
    SharedModule,
    NgOptimizedImage,
    ReactiveFormsModule,
  ],
})
export class ForgotPasswordModule {}
