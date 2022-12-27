import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { BroadcastBatchUploadListRoutingModule } from './broadcast-batch-upload-list-routing.module';
import { ListComponent } from './components/list/list.component';
import { BroadcastContentUploadService } from 'src/app/helpers/services/broadcast-content-upload/broadcast-content-upload.service';

@NgModule({
  declarations: [
    ListComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    BroadcastBatchUploadListRoutingModule
  ],
  providers: [BroadcastContentUploadService]
})

export class BroadcastBatchUploadListModule { }
