import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserBulkUploadRoutingModule } from './user-bulk-upload-routing.module';
import { ListComponent } from './components/list/list.component';
import { SharedModule } from '../shared/shared.module';
import { SubmodulesService } from 'src/app/helpers/services/submodules/submodules.service';

@NgModule({
  declarations: [ListComponent],
  imports: [
    CommonModule,
    UserBulkUploadRoutingModule,
    SharedModule
  ],
  providers: [SubmodulesService]
})

export class UserBulkUploadModule { }
