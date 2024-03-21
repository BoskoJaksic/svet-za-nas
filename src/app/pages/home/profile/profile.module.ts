import { NgModule } from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfilePageRoutingModule } from './profile-routing.module';

import { ProfilePage } from './profile.page';
import {SharedModule} from "../../../shared/shared.module";
import {AddChildModalComponent} from "../../../components/modal/add-child-modal/add-child-modal.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfilePageRoutingModule,
    SharedModule,
    NgOptimizedImage
  ],
  declarations: [ProfilePage, AddChildModalComponent]
})
export class ProfilePageModule {}
