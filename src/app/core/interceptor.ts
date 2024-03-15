import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {LocalStorageService} from "../common/services/local-storage.service";
import {catchError, Observable, switchMap, throwError} from "rxjs";
import {CommonService} from "../common/services/common.service";
import {UserService} from "../common/services/user.service";

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {

  constructor(private localStorageService:LocalStorageService,
              private commonService:CommonService,
              private userService:UserService,

              ) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.localStorageService.getUserToken();

    if (token) {
      request = this.addToken(request, token);
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          return this.handle401Error(request, next);
        }
        return throwError(error);
      })
    );
  }
  private addToken(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let userRefreshToken = this.localStorageService.getUserRefreshToken()
    return this.userService.getRefreshToken(userRefreshToken).pipe(
      switchMap((response: any) => {
        const newToken = response.access_token;
        const newRefreshToken = response.refresh_token;

        if (newToken && newRefreshToken) {
          this.localStorageService.setUserToken(newToken);
          this.localStorageService.setUserRefreshToken(newRefreshToken);
          const newRequest = this.addToken(request, newToken);
          return next.handle(newRequest);
        }
        // this.appPathService.setAppPath('');todo
        this.commonService.goToRoute('/')
        return throwError('Neuspjelo osvježavanje tokena');
      }),
      catchError((error) => {
        // this.appPathService.setAppPath('');
        this.commonService.goToRoute('/')
        return throwError(error);
      })
    );
  }
}
