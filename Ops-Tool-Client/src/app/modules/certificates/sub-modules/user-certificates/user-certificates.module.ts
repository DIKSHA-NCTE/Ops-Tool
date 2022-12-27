import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { CertificatesService } from 'src/app/helpers/services/certificates/certificates.service';
import { UserCertificatesRoutingModule } from './user-certificates-routing.module';
import { UserCertificatesComponent } from './components/user-certificates/user-certificates.component';


@NgModule({
  declarations: [
    UserCertificatesComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    UserCertificatesRoutingModule
  ],
  providers: [CertificatesService]
})
export class UserCertificatesModule { }
