import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NTPCONSTANTS } from 'src/app/constants';
import { AuthGuard } from 'src/app/helpers/guards/authGuard';
import { CourseCertificatesComponent } from './components/course-certificates/course-certificates.component';

const routes: Routes = [
  {
    path: NTPCONSTANTS.ROUTERLINKS.CERTIFICATES.COURSE, component: CourseCertificatesComponent,
    data: {
      breadcrumb: [
        {
          label: '<i class="material-icons">home</i>',
          url: '/dashboard',
          active: false
        }, {
          label: 'Certificates',
          url: '/certificates/list',
          active: false
        }, {
          label: 'Course Certificates',
          url: '/certificates/course',
          active: true
        }
      ],
    },
    canActivate: [AuthGuard]
  },
  { path: '', redirectTo: NTPCONSTANTS.ROUTERLINKS.DASHBOARD, pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CourseCertificatesRoutingModule { }
