import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from 'src/app/shared/shared.module';
import { UsersComponent } from './users.component';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule } from '@angular/material/paginator';
@NgModule({
  declarations: [UsersComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UsersRoutingModule,
    SharedModule,
    MatTableModule,
    MatCheckboxModule,
    MatPaginatorModule,
  ],
})
export class UsersModule {}
