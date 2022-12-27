import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NTPCONSTANTS } from 'src/app/constants';
import { AuthGuard } from 'src/app/helpers/guards/authGuard';
import { DashboardComponent } from './components/dashboard/dashboard.component';

const dashboardRoutes: Routes = [
  {
    path: NTPCONSTANTS.ROUTERLINKS.DASHBOARD, component: DashboardComponent,
    data: {
      breadcrumb: [
        {
          label: '<i class="material-icons">home</i>',
          url: '/dashboard',
          active: true
        }, {
          label: 'Dashboard',
          url: '/dashboard',
          active: true
        }
      ],
    },
    canActivate: [AuthGuard]
  },
  { path: '', redirectTo: NTPCONSTANTS.ROUTERLINKS.DASHBOARD, pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(dashboardRoutes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
