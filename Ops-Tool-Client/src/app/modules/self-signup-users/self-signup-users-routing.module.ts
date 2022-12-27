import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NTPCONSTANTS } from 'src/app/constants';
import { AuthGuard } from 'src/app/helpers/guards/authGuard';
import { ListComponent } from './components/list/list.component';

const ssuroutes: Routes = [
  {
    path: NTPCONSTANTS.ROUTERLINKS.REPORTS.SSU, component: ListComponent,
    data: {
      breadcrumb: [
        {
          label: '<i class="material-icons">home</i>',
          url: '/dashboard',
          active: false
        }, {
          label: 'Reports',
          url: '/reports/list',
          active: false
        },
        {
          label: 'Self Signup Users',
          url: '/reports/self-signup-users',
          active: true
        }
      ],
    },
    canActivate: [AuthGuard]
  },
  { path: '', redirectTo: NTPCONSTANTS.ROUTERLINKS.DASHBOARD, pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(ssuroutes)],
  exports: [RouterModule]
})
export class SelfSignupUsersRoutingModule { }
