import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { CertificatesService } from 'src/app/helpers/services/certificates/certificates.service';
import { CourseCertificatesRoutingModule } from './course-certificates-routing.module';
import { CourseCertificatesComponent } from './components/course-certificates/course-certificates.component';


@NgModule({
  declarations: [
    CourseCertificatesComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    CourseCertificatesRoutingModule
  ],
  providers: [CertificatesService]
})
export class CourseCertificatesModule { }
