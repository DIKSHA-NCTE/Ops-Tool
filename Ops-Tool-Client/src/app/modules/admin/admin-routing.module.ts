import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NTPCONSTANTS } from 'src/app/constants';
import { AuthGuard } from 'src/app/helpers/guards/authGuard';
import { ConstantsComponent } from './constants/constants.component';
import { ModulesComponent } from './modules/modules.component';
import { SupportUsersComponent } from './support-users/support-users/support-users.component';

const routes: Routes = [
  {
    path: NTPCONSTANTS.ROUTERLINKS.ADMIN.CONSTANTS, component: ConstantsComponent,
    data: {
      breadcrumb: [
        {
          label: '<i class="material-icons">home</i>',
          url: '/dashboard',
          active: false
        },
        {
          label: 'Configurations',
          url: '/admin/constants/list',
          active: true
        }
      ]
    },
    canActivate: [AuthGuard]
  },
  {
    path: NTPCONSTANTS.ROUTERLINKS.ADMIN.MODULES, component: ModulesComponent,
    data: {
      breadcrumb: [
        {
          label: '<i class="material-icons">home</i>',
          url: '/dashboard',
          active: false
        },
        {
          label: 'Modules',
          url: '/admin/modules/list',
          active: true
        }
      ],
    },
    canActivate: [AuthGuard]
  },
  {
    path: NTPCONSTANTS.ROUTERLINKS.ADMIN.SUPPORT_USERS, component: SupportUsersComponent,
    data: {
      breadcrumb: [
        {
          label: '<i class="material-icons">home</i>',
          url: '/dashboard',
          active: false
        },
        {
          label: 'Support Users',
          url: '/admin/support-users/list',
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
export class AdminRoutingModule { }
