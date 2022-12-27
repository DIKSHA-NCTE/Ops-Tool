import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { ShallowCopyBatchListRoutingModule } from './shallow-copy-batch-list-routing.module';
import { ListComponent } from './components/list/list.component';
import { ShallowCopyService } from 'src/app/helpers/services/shallow-copy/shallow-copy.service';

@NgModule({
  declarations: [
    ListComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ShallowCopyBatchListRoutingModule
  ],
  providers: [ShallowCopyService]
})

export class ShallowCopyBatchListModule { }
