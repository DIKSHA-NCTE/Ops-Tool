import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { SelfSignupUsersRoutingModule } from './self-signup-users-routing.module';
import { ListComponent } from './components/list/list.component';
import { SelfSignupUsersService } from 'src/app/helpers/services/self-signup-users/self-signup-users.service';


@NgModule({
  declarations: [
    ListComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    SelfSignupUsersRoutingModule
  ],
  providers: [SelfSignupUsersService]
})
export class SelfSignupUsersModule { }
