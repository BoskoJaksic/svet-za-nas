import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/common/services/common.service';
import { ToasterService } from 'src/app/common/services/toaster.service';
import { UserService } from 'src/app/common/services/user.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  newPassword: string = '';
  confirmPassword: string = '';
  loginSpinner: boolean = false;
  token: string = '';

  constructor(
    private userService: UserService,
    private toasterService: ToasterService,
    private commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.getQueryParams();
  }

  getQueryParams(): void {
    const params = this.commonService.getQueryParams();
    this.token = params['token'];
  }

  onSubmit() {
    if (!this.newPassword || !this.confirmPassword) {
      this.toasterService.presentToast('Unesite lozinku.', 'danger');
      return;
    }
    if (this.newPassword !== this.confirmPassword) {
      this.toasterService.presentToast(
        'Lozinke se ne poklapaju, pokušajte ponovo.',
        'danger'
      );
      return;
    }

    this.loginSpinner = true;
    let dto = {
      token: this.token,
      newPassword: this.newPassword,
    };
    this.userService.resetPassword(dto).subscribe(
      (res) => {
        this.loginSpinner = false;
        this.toasterService.presentToast(
          'Lozinka je uspešno izmenjena. Sada se možete prijaviti.',
          'success'
        );
        this.commonService.goToRoute('/');
      },
      (err) => {
        this.loginSpinner = false;
        this.toasterService.presentToast(
          'Greška prilikom izmene lozinke.',
          'danger'
        );
      }
    );
  }
}
