import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonService } from '../../common/services/common.service';
import { LoginService } from '../../common/services/login-register/login.service';
import { LocalStorageService } from '../../common/services/local-storage.service';
import { ToasterService } from '../../common/services/toaster.service';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { jwtDecode } from 'jwt-decode';
import { FacebookLogin } from '@capacitor-community/facebook-login';
import { UserService } from '../../common/services/user.service';
import { HttpClient } from '@angular/common/http';
import { LoaderService } from '../../common/services/loader.service';
import {
  SignInWithApple,
  SignInWithAppleResponse,
  SignInWithAppleOptions,
} from '@capacitor-community/apple-sign-in';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  rememberMe: boolean = false;
  loginSpinner: boolean = false;
  errorMessage: string = '';
  token: any = null;
  @Output() loginChanged = new EventEmitter<boolean>();

  FACEBOOK_PERMISSIONS = ['email'];

  constructor(
    public commonService: CommonService,
    private localStorageService: LocalStorageService,
    private toasterService: ToasterService,
    private userService: UserService,
    private loaderService: LoaderService,
    private loginService: LoginService,
    private http: HttpClient
  ) {}

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
    this.loginService.loginUser(formData).subscribe({
      next: (r) => {
        this.localStorageService.setUserEmail(this.email);
        this.localStorageService.setUserToken(r.accessToken);
        this.localStorageService.setUserRefreshToken(r.refreshToken);
        this.localStorageService.setIsFromFacebookLoggedIn(false);

        this.commonService.goToRoute('home');
        this.loginSpinner = false;
      },
      error: (err) => {
        this.loginSpinner = false;
        this.errorMessage = err.message;
        this.toasterService.presentToast(err.error[0], 'warning');
      },
    });
  }

  async googleLogin() {
    this.loaderService.showLoader();
    GoogleAuth.signIn().then(
      (r) => {
        const user = r;
        let dataToSend = {
          email: user.email,
          provider: 'Google',
          idToken: user.authentication.idToken,
        };
        this.errorMessage = user.email;
        this.loginService.googleLoginIn(dataToSend).subscribe({
          next: (r) => {
            const decodedToken = jwtDecode(r.accessToken);
            // @ts-ignore
            this.localStorageService.setUserEmail(decodedToken.email);
            this.localStorageService.setUserToken(r.accessToken);
            this.localStorageService.setUserRefreshToken(r.refreshToken);
            this.localStorageService.setIsFromFacebookLoggedIn(false);
            this.loaderService.hideLoader();
            setTimeout(() => {
              this.commonService.goToRoute('home');
            }, 200);
          },
          error: (err) => {
            this.toasterService.presentToast(err.error[0], 'warning');
            this.errorMessage = err.message;
            this.loaderService.hideLoader();
          },
        });
      },
      (e: any) => {
        this.loaderService.hideLoader();
      }
    );
  }

  async facebookLogin() {
    this.loaderService.showLoader();

    await FacebookLogin.login({ permissions: this.FACEBOOK_PERMISSIONS }).then(
      (result) => {
        if (result?.accessToken) {
          this.loginService
            .facebookLoginIn(result.accessToken.token)
            .subscribe({
              next: (r) => {
                const decodedToken = jwtDecode(r.accessToken);
                // @ts-ignore
                this.localStorageService.setUserEmail(decodedToken.email);
                this.localStorageService.setUserToken(r.accessToken);
                this.localStorageService.setUserRefreshToken(r.refreshToken);
                this.localStorageService.setIsFromFacebookLoggedIn(true);
                this.loaderService.hideLoader();

                setTimeout(() => {
                  this.commonService.goToRoute('home');
                }, 200);
              },
              error: (err) => {
                this.loaderService.hideLoader();
                this.errorMessage = err.message;
                this.toasterService.presentToast(err.error[0], 'warning');
              },
            });
        } else {
          this.loaderService.hideLoader();
        }
      },
      (e: any) => {
        this.loaderService.hideLoader();
      }
    );
  }

  appleLogin() {
    let options: SignInWithAppleOptions = {
      clientId: 'com.bebac.app',
      redirectURI: 'https://svet-za-nas.wedosoftware.eu/',
      scopes: 'email name',
      state: '12345',
      nonce: 'nonce',
    };

    SignInWithApple.authorize(options)
      .then((result: SignInWithAppleResponse) => {
        console.log('result: ', result);
        let dataToSend = {
          email: result.response.email,
          identityToken: result.response.identityToken,
        };
        this.doAppleLogin(dataToSend);
        // Handle user information
        // Validate token with server and create new session
      })
      .catch((error) => {
        // Handle error
      });
  }

  doAppleLogin(data: any) {
    this.loaderService.showLoader();
    this.loginService.appleLogin(data).subscribe({
      next: (r) => {
        const decodedToken = jwtDecode(r.accessToken);
        // @ts-ignore
        this.localStorageService.setUserEmail(decodedToken.email);
        this.localStorageService.setUserToken(r.accessToken);
        this.localStorageService.setUserRefreshToken(r.refreshToken);
        this.loaderService.hideLoader();

        setTimeout(() => {
          this.commonService.goToRoute('home');
        }, 200);
      },
      error: (err) => {
        this.loaderService.hideLoader();
        this.errorMessage = err.message;
        this.toasterService.presentToast(err.error[0], 'warning');
      },
    });
  }
}
