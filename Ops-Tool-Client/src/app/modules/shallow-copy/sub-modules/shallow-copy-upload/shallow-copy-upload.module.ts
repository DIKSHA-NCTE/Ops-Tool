import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { ShallowCopyUploadRoutingModule } from './shallow-copy-upload-routing.module';
import { ListComponent } from './components/list/list.component';
import { ShallowCopyService } from 'src/app/helpers/services/shallow-copy/shallow-copy.service';
import { ClipboardModule } from '@angular/cdk/clipboard';

@NgModule({
  declarations: [
    ListComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ShallowCopyUploadRoutingModule,
    ClipboardModule
  ],
  providers: [ShallowCopyService]
})

export class ShallowCopyUploadModule { }
