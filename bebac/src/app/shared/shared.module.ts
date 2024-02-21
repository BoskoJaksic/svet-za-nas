import {NgModule} from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {CommonModule, NgOptimizedImage} from "@angular/common";
import {RouterLink} from "@angular/router";
import {MenuComponentComponent} from "../components/menu-component/menu-component.component";
import {MenuButtonComponent} from "../components/menu-component/menu-button/menu-button.component";

@NgModule({
  declarations: [MenuComponentComponent,MenuButtonComponent],
  imports: [
    IonicModule,
    NgOptimizedImage,
    CommonModule,
    RouterLink,
  ],
  exports: [
    MenuComponentComponent,
    MenuButtonComponent
  ]
})
export class SharedModule {
}
