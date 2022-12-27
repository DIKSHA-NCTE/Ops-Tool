import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { UploadUserRoutingModule } from './upload-user-routing.module';
import { ListComponent } from './components/list/list.component';
import { UsersBulkUploadService } from 'src/app/helpers/services/users-bulk-upload/users-bulk-upload.service';
import { ClipboardModule } from '@angular/cdk/clipboard';

@NgModule({
  declarations: [
    ListComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    UploadUserRoutingModule,
    ClipboardModule
  ],
  providers: [UsersBulkUploadService]
})

export class UploadUserModule { }
