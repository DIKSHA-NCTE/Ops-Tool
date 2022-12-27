import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { OrganizationsService } from 'src/app/helpers/services/organizations/organizations.service';
import { CreateOrganizationsRoutingModule } from './create-organizations-routing.module';
import { ListComponent } from './components/list/list.component';


@NgModule({
  declarations: [
    ListComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    CreateOrganizationsRoutingModule
  ],
  providers: [OrganizationsService]
})

export class CreateOrganizationsModule { }
