import {NgModule} from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {CommonModule, NgOptimizedImage} from "@angular/common";
import {RouterLink, RouterLinkActive} from "@angular/router";
import {MenuComponentComponent} from "../components/menu-component/menu-component.component";
import {MenuButtonComponent} from "../components/menu-component/menu-button/menu-button.component";
import {AvatarComponent} from "../components/avatar/avatar.component";
import {OurWorldComponent} from "../components/our-world/our-world.component";

@NgModule({
  declarations: [MenuComponentComponent,MenuButtonComponent,AvatarComponent,OurWorldComponent],
    imports: [
        IonicModule,
        NgOptimizedImage,
        CommonModule,
        RouterLink,
        RouterLinkActive,
    ],
  exports: [
    MenuComponentComponent,
    MenuButtonComponent,
    AvatarComponent,
    OurWorldComponent
  ]
})
export class SharedModule {
}
