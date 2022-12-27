import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AdminRoutingModule } from './admin-routing.module';
import { ConstantsComponent } from './constants/constants.component';
import { ModulesComponent } from './modules/modules.component';
import { SharedModule } from '../shared/shared.module';
import { SupportUsersComponent } from './support-users/support-users/support-users.component';


@NgModule({
  declarations: [
    ConstantsComponent,
    ModulesComponent,
    SupportUsersComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AdminRoutingModule,
    SharedModule
  ],
  providers: []
})
export class AdminModule { }
