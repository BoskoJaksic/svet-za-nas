import { NgModule } from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {CommonModule, NgOptimizedImage} from "@angular/common";
import {RouterLink} from "@angular/router";
import {MatFormField, MatLabel, MatPrefix, MatSuffix} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";

@NgModule({
  declarations: [],
  imports: [
    IonicModule,
    NgOptimizedImage,
    CommonModule,
    RouterLink
  ],
  exports: [

  ]
})
export class SharedModule { }
