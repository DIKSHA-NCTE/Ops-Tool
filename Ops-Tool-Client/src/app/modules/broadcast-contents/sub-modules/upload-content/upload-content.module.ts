import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { UploadContentRoutingModule } from './upload-content-routing.module';
import { ListComponent } from './components/list/list.component';
import { BroadcastContentUploadService } from 'src/app/helpers/services/broadcast-content-upload/broadcast-content-upload.service';
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
  providers: [BroadcastContentUploadService]
})

export class UploadContentModule { }
