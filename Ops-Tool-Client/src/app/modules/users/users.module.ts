import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersRoutingModule } from './users-routing.module';
import { ListComponent } from './components/list/list.component';
import { SharedModule } from '../shared/shared.module';
import { SubmodulesService } from 'src/app/helpers/services/submodules/submodules.service';

@NgModule({
  declarations: [ListComponent],
  imports: [
    CommonModule,
    UsersRoutingModule,
    SharedModule
  ],
  providers: [SubmodulesService]
})

export class UsersModule { }
