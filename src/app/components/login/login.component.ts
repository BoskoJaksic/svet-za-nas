import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {CommonService} from '../../common/services/common.service';
import {LoginService} from '../../common/services/login-register/login.service';
import {LocalStorageService} from '../../common/services/local-storage.service';
import {ToasterService} from '../../common/services/toaster.service';
import {GoogleAuth, User} from '@codetrix-studio/capacitor-google-auth';
import {jwtDecode} from 'jwt-decode';
import {FacebookLogin,} from '@capacitor-community/facebook-login';
import {UserService} from "../../common/services/user.service";
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';
  rememberMe: boolean = false;
  loginSpinner: boolean = false;
  errorMessage: string = '';
  token: any = null;
  @Output() loginChanged = new EventEmitter<boolean>();

  FACEBOOK_PERMISSIONS = [
    'email',
  ];

  constructor(
    private commonService: CommonService,
    private localStorageService: LocalStorageService,
    private toasterService: ToasterService,
    private userService: UserService,
    private loginService: LoginService,
    private http: HttpClient
  ) {

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
      rememberMe: this.rememberMe,
    };
    this.loginSpinner = true;
    console.log(formData);
    this.loginService.loginUser(formData).subscribe({
      next: (r) => {
        console.log('r', r);
        // if (r.statusCode === 401) {
        //   this.toasterService.presentToast(
        //     'Pogresni kredencijali ili korisnik nije autorizovan',
        //     'warning'
        //   );
        //   this.loginSpinner = false;
        //   return;
        // }
        this.localStorageService.setUserEmail(this.email);
        this.localStorageService.setUserToken(r.accessToken);
        this.localStorageService.setUserRefreshToken(r.refreshToken);
        this.commonService.goToRoute('home');
        this.loginSpinner = false;
      },
      error: (err) => {
        // if (err.status === 500) {
        //   {
        //     this.toasterService.presentToast('Pogresni kredencijali ili korisnik nije autorizovan', 'warning')
        //   }
        // }
        // this.toasterService.presentToast(err.error[0], 'warning');
        this.loginSpinner = false;
        this.errorMessage = err.message;
        console.log('err', err);
      },
    });
  }

  async googleLogin() {
    const user: User = await GoogleAuth.signIn();
    let dataToSend = {
      email: user.email,
      provider: 'Google',
      idToken: user.authentication.idToken,
    };
    this.errorMessage = user.email;
    this.loginService.googleLoginIn(dataToSend).subscribe({
      next: (r) => {
        console.log('loginresp', r);
        const decodedToken = jwtDecode(r.accessToken);
        // @ts-ignore
        this.localStorageService.setUserEmail(decodedToken.email);
        this.localStorageService.setUserToken(r.accessToken);
        this.localStorageService.setUserRefreshToken(r.refreshToken);
        setTimeout(() => {
          this.commonService.goToRoute('home');
        }, 200);
      },
      error: (err) => {
        console.log('login err', err);
        this.errorMessage = err.message;
      },
    });

    console.log('gogle user', user);
  }

  async facebookLogin() {
    const result = await FacebookLogin.login({permissions: this.FACEBOOK_PERMISSIONS})
    if (result.accessToken) {
      this.loginService.facebookLoginIn(result.accessToken.token).subscribe({
        next: (r) => {
          console.log('fb login resp', r);
          const decodedToken = jwtDecode(r.accessToken);
          // @ts-ignore
          this.localStorageService.setUserEmail(decodedToken.email);
          this.localStorageService.setUserToken(r.accessToken);
          this.localStorageService.setUserRefreshToken(r.refreshToken);
          setTimeout(() => {
            this.commonService.goToRoute('home');
          }, 200);
        },
        error: (err) => {
          console.log('login err', err);
          this.errorMessage = err.message;
          this.toasterService.presentToast(err.error[0],'warning')
        },
      });
    }
    console.log('result', result)
  }
}
