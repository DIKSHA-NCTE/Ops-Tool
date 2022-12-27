import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { UserUploadStatusRoutingModule } from './user-upload-status-routing.module';
import { ListComponent } from './components/list/list.component';
import { UsersBulkUploadService } from 'src/app/helpers/services/users-bulk-upload/users-bulk-upload.service';

@NgModule({
  declarations: [
    ListComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    UserUploadStatusRoutingModule
  ],
  providers: [UsersBulkUploadService]
})

export class UserUploadStatusModule { }
