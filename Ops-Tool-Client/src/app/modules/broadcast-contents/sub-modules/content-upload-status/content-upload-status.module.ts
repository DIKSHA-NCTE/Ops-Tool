import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { ContentUploadStatusRoutingModule } from './content-upload-status-routing.module';
import { ListComponent } from './components/list/list.component';
import { BroadcastContentUploadService } from 'src/app/helpers/services/broadcast-content-upload/broadcast-content-upload.service';

@NgModule({
  declarations: [
    ListComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ContentUploadStatusRoutingModule
  ],
  providers: [BroadcastContentUploadService]
})

export class ContentUploadStatusModule { }
