import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportsRoutingModule } from './reports-routing.module';
import { ListComponent } from './components/list/list.component';
import { SharedModule } from '../shared/shared.module';
import { SubmodulesService } from 'src/app/helpers/services/submodules/submodules.service';

@NgModule({
  declarations: [ListComponent],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    SharedModule
  ],
  providers: [SubmodulesService]
})

export class ReportsModule { }
