import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './components/list/list.component';
import {ContentsRoutingModule} from './contents-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ContentsService } from 'src/app/helpers/services/contents/contents.service';

@NgModule({
  declarations: [
    ListComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ContentsRoutingModule
  ],
  providers: [ContentsService]
})
export class ContentsModule { }
