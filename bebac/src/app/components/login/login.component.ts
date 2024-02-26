import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {CommonService} from "../../common/services/common.service";
import {LoginService} from "../../common/services/login-register/login.service";
import {LocalStorageService} from "../../common/services/local-storage.service";
import {ToasterService} from "../../common/services/toaster.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent  implements OnInit {
  email: string = ''
  password: string = ''
  rememberMe: boolean = false
  @Output() loginChanged = new EventEmitter<boolean>();

  constructor(private commonService:CommonService,
              private localStorageService:LocalStorageService,
              private toasterService:ToasterService,
              private loginService:LoginService) { }

  ngOnInit() {}
  showRegisterPage(){
    this.loginChanged.emit(false);

  }
  onSubmit() {
    const formData = {
      username: this.email,
      password: this.password,
      // rememberMe:this.rememberMe
    };
    console.log(formData)
    this.loginService.loginUser(formData).subscribe({
      next: (r) => {
        console.log('r', r)
        if (r.statusCode === 401){
          this.toasterService.presentToast('Pogresni kredencijali ili korisnik nije autorizovan','warning')
          return;
        }
        this.localStorageService.setUserEmail(this.email);
        this.commonService.goToRoute('home')
      }, error: (err) => {
        if (err.status === 500){{
          this.toasterService.presentToast('Pogresni kredencijali ili korisnik nije autorizovan','warning')

        }
        }
        console.log('err', err)
      }
    })


  }
}
