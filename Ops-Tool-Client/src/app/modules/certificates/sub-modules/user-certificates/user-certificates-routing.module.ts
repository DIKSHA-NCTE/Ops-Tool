import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NTPCONSTANTS } from 'src/app/constants';
import { AuthGuard } from 'src/app/helpers/guards/authGuard';
import { UserCertificatesComponent } from './components/user-certificates/user-certificates.component';

const routes: Routes = [
  {
    path: NTPCONSTANTS.ROUTERLINKS.CERTIFICATES.USER, component: UserCertificatesComponent,
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
          label: 'User Certificates',
          url: '/certificates/user',
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
export class UserCertificatesRoutingModule { }
