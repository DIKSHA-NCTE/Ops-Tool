import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { ShallowCopyStatusRoutingModule } from './shallow-copy-status-routing.module';
import { ListComponent } from './components/list/list.component';
import { ShallowCopyService } from 'src/app/helpers/services/shallow-copy/shallow-copy.service';

@NgModule({
  declarations: [
    ListComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ShallowCopyStatusRoutingModule
  ],
  providers: [ShallowCopyService]
})

export class ShallowCopyStatusModule { }
