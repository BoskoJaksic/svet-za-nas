import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';

import {IonicModule, IonicRouteStrategy} from '@ionic/angular';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {HttpInterceptorService} from "./core/interceptor";
import {LoaderComponent} from "./components/loader/loader.component";
import {NgOptimizedImage} from "@angular/common";

@NgModule({
  declarations: [AppComponent, LoaderComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule, NgOptimizedImage],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: HttpInterceptorService,
    multi: true
  },
    {provide: RouteReuseStrategy, useClass: IonicRouteStrategy}, provideAnimationsAsync()],
  bootstrap: [AppComponent],

})
export class AppModule {
}
