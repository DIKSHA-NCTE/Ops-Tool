import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BroadcastContentsRoutingModule } from './broadcast-contents-routing.module';
import { ListComponent } from './components/list/list.component';
import { SharedModule } from '../shared/shared.module';
import { SubmodulesService } from 'src/app/helpers/services/submodules/submodules.service';

@NgModule({
  declarations: [ListComponent],
  imports: [
    CommonModule,
    BroadcastContentsRoutingModule,
    SharedModule
  ],
  providers: [SubmodulesService]
})

export class BroadcastContentsModule { }
