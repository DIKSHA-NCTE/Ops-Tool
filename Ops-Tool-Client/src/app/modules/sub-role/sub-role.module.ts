import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { SubRoleRoutingModule } from './sub-role-routing.module';
import { SubRoleComponent } from './components/sub-role/sub-role.component';
import { SubRoleService } from 'src/app/helpers/services/sub-role/sub-role.service';

@NgModule({
  declarations: [
    SubRoleComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    SubRoleRoutingModule
  ],
  providers: [SubRoleService]
})

export class SubroleModule { }
