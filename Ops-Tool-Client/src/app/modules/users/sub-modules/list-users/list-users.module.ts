import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { UsersService } from 'src/app/helpers/services/users/users.service';
import { ListUsersRoutingModule } from './list-users-routing.module';
import { ListComponent } from './components/list/list.component';


@NgModule({
  declarations: [
    ListComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ListUsersRoutingModule
  ],
  providers: [UsersService]
})
export class ListUsersModule { }
