import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NTPCONSTANTS } from 'src/app/constants';
import { AuthGuard } from 'src/app/helpers/guards/authGuard';
import { ListComponent } from './components/list/list.component';

const contentRoutes: Routes = [
  {
    path: NTPCONSTANTS.ROUTERLINKS.CONTENTS.LIST, component: ListComponent,
    data: {
      breadcrumb: [
        {
          label: '<i class="material-icons">home</i>',
          url: '/dashboard',
          active: false
        }, {
          label: 'Contents',
          url: '/contents/list',
          active: true
        }
      ],
    },
    canActivate: [AuthGuard]
  },
  { path: '', redirectTo: NTPCONSTANTS.ROUTERLINKS.DASHBOARD, pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(contentRoutes)],
  exports: [RouterModule]
})
export class ContentsRoutingModule { }
