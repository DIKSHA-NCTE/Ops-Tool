import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { UserBatchUploadListRoutingModule } from './user-batch-upload-list-routing.module';
import { ListComponent } from './components/list/list.component';
import { UsersBulkUploadService } from 'src/app/helpers/services/users-bulk-upload/users-bulk-upload.service';

@NgModule({
  declarations: [
    ListComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    UserBatchUploadListRoutingModule
  ],
  providers: [UsersBulkUploadService]
})

export class UserBatchUploadListModule { }
