import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { ContentUploadStatusRoutingModule } from './content-upload-status-routing.module';
import { ListComponent } from './components/list/list.component';
import { ContentsBulkUploadService } from 'src/app/helpers/services/contents-bulk-upload/contents-bulk-upload.service';

@NgModule({
  declarations: [
    ListComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ContentUploadStatusRoutingModule
  ],
  providers: [ContentsBulkUploadService]
})

export class ContentUploadStatusModule { }
