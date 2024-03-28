import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { LocalStorageService } from '../common/services/local-storage.service';
import { catchError, Observable, of, switchMap, throwError } from 'rxjs';
import { CommonService } from '../common/services/common.service';
import { UserService } from '../common/services/user.service';
import { AppPathService } from '../common/services/app-path.service';

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {
  constructor(
    private localStorageService: LocalStorageService,
    private commonService: CommonService,
    private userService: UserService,
    private appPathService: AppPathService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
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
        Authorization: `Bearer ${token}`,
      },
    });
  }

  private handle401Error(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // if (retryCount >= this.maxRetry) {
    //   this.appPathService.setAppPath('');
    //   this.commonService.goToRoute('/');
    //   return throwError('Neuspjelo osvježavanje tokena, preusmeravanje na prijavu.');
    // }

    let dataToSend = {
      accessToken: this.localStorageService.getUserToken(),
      refreshToken: this.localStorageService.getUserRefreshToken(),
    };
    if (!dataToSend.accessToken || !dataToSend.refreshToken) {
      this.commonService.goToRoute('/');
      return throwError(
        () => new Error('Tokeni nisu dostupni, preusmeravanje na prijavu.')
      );
    }
    return this.userService.getRefreshToken(dataToSend).pipe(
      switchMap((response: any) => {
        const newToken = response.accessToken; //todo check for this response how it looks like
        const newRefreshToken = response.refreshToken;

        if (newToken && newRefreshToken) {
          this.localStorageService.setUserToken(newToken);
          this.localStorageService.setUserRefreshToken(newRefreshToken);
          const newRequest = this.addToken(request, newToken);
          return next.handle(newRequest);
        }
        this.appPathService.setAppPath('');
        this.commonService.goToRoute('/');
        return throwError(() => new Error('Neuspjelo osvježavanje tokena'));
      }),
      catchError((err) => {
        this.commonService.goToRoute('/');
        return of(null as unknown as HttpEvent<any>);
      })
    );
  }
}
