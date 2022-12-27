import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { UploadContentRoutingModule } from './upload-content-routing.module';
import { ListComponent } from './components/list/list.component';
import { ContentsBulkUploadService } from 'src/app/helpers/services/contents-bulk-upload/contents-bulk-upload.service';
import { ClipboardModule } from '@angular/cdk/clipboard';

@NgModule({
  declarations: [
    ListComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    UploadContentRoutingModule,
    ClipboardModule
  ],
  providers: [ContentsBulkUploadService]
})

export class UploadContentModule { }
