import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { OrganizationsService } from 'src/app/helpers/services/organizations/organizations.service';
import { UpdateOrganizationsRoutingModule } from './update-organizations-routing.module';
import { ListComponent } from './components/list/list.component';


@NgModule({
  declarations: [
    ListComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    UpdateOrganizationsRoutingModule
  ],
  providers: [OrganizationsService]
})

export class UpdateOrganizationsModule { }
