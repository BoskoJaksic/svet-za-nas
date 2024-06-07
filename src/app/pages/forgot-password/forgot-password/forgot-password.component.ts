import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/common/services/common.service';
import { ToasterService } from 'src/app/common/services/toaster.service';
import { UserService } from 'src/app/common/services/user.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent {
  email: string = '';
  loginSpinner: boolean = false;

  constructor(
    private userService: UserService,
    private toastersService: ToasterService,
    private commonService: CommonService
  ) {}

  onSubmit() {
    if (!this.email) {
      this.toastersService.presentToast('Unesite email', 'danger');
      return;
    }
    this.loginSpinner = true;
    this.userService.forgotPassword(this.email).subscribe(
      (res) => {
        this.loginSpinner = false;
        this.toastersService.presentToast(
          'Email za resetovanje lozinke je poslat.',
          'success'
        );
        this.commonService.goToRoute('/');
      },
      (err) => {
        this.loginSpinner = false;
        this.toastersService.presentToast(
          err.error[0] ? err.error[0] : 'Greška prilikom izmene lozinke.`',
          'danger'
        );
      }
    );
  }
}
