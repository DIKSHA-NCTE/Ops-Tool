import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './components/list/list.component';
import { FormsRoutingModule } from './forms-routing.module';
import { SharedModule } from '../shared/shared.module';
import { FormsService } from 'src/app/helpers/services/forms/forms.service';

@NgModule({
  declarations: [
    ListComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsRoutingModule
  ],
  providers: [FormsService]
})
export class FormsModule { }
