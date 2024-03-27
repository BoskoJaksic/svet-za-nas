import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {CommonService} from "../../common/services/common.service";
import {LoginService} from "../../common/services/login-register/login.service";
import {LocalStorageService} from "../../common/services/local-storage.service";
import {ToasterService} from "../../common/services/toaster.service";
import {GoogleAuth, User} from "@codetrix-studio/capacitor-google-auth";
import {jwtDecode} from "jwt-decode";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  email: string = ''
  password: string = ''
  rememberMe: boolean = false;
  loginSpinner: boolean = false;
  errorMessage: string = ''
  @Output() loginChanged = new EventEmitter<boolean>();

  constructor(private commonService: CommonService,
              private localStorageService: LocalStorageService,
              private toasterService: ToasterService,
              private loginService: LoginService) {
  }

  ngOnInit() {
  }

  showRegisterPage() {
    this.loginChanged.emit(false);

  }

  onSubmit() {
    const formData = {
      username: this.email,
      password: this.password,
      rememberMe: this.rememberMe
    };
    this.loginSpinner = true;
    console.log(formData)
    this.loginService.loginUser(formData).subscribe({
      next: (r) => {
        console.log('r', r)
        if (r.statusCode === 401) {
          this.toasterService.presentToast('Pogresni kredencijali ili korisnik nije autorizovan', 'warning');
          this.loginSpinner = false;
          return;
        }
        this.localStorageService.setUserEmail(this.email);
        this.localStorageService.setUserToken(r.value.accessToken);
        this.localStorageService.setUserRefreshToken(r.value.refreshToken);
        this.commonService.goToRoute('home');
        this.loginSpinner = false;

      }, error: (err) => {
        if (err.status === 500) {
          {
            this.toasterService.presentToast('Pogresni kredencijali ili korisnik nije autorizovan', 'warning')
          }
        }
        this.loginSpinner = false;
        this.errorMessage = err.message
        console.log('err', err)
      }
    })


  }

  async googleLogin() {
    const user: User = await GoogleAuth.signIn();
    let dataToSend = {
      email: user.email,
      provider: "Google",
      idToken: user.authentication.idToken
    }
    this.errorMessage = user.email
    this.loginService.googleLoginIn(dataToSend).subscribe({
        next: (r) => {
          console.log('loginresp', r)
          if (r.statusCode === 200) {
            const decodedToken = jwtDecode(r.value.accessToken);
            // @ts-ignore
            this.localStorageService.setUserEmail(decodedToken.email);
            this.localStorageService.setUserToken(r.value.accessToken);
            this.localStorageService.setUserRefreshToken(r.value.refreshToken);
            setTimeout(()=>{
            this.commonService.goToRoute('home')
            },200)
          }

        }, error: (err) => {
          console.log('login err', err)
          this.errorMessage = err.message;
        }
      }
    )

    console.log('gogle user', user)
  }
}
