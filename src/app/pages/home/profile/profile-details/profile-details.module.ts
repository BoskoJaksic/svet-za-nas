import { NgModule } from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfileDetailsPageRoutingModule } from './profile-details-routing.module';

import { ProfileDetailsPage } from './profile-details.page';
import {SharedModule} from "../../../../shared/shared.module";
import {ProfilePageModule} from "../profile.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ProfileDetailsPageRoutingModule,
        NgOptimizedImage,
        SharedModule,
        ProfilePageModule
    ],
  declarations: [ProfileDetailsPage]
})
export class ProfileDetailsPageModule {}
