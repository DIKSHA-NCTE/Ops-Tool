import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NTPCONSTANTS } from './constants';

const routes: Routes = [
  // {
  //   path: NTPCONSTANTS.ROUTERLINKS.DASHBOARD, loadChildren: () => import('./modules/dashboard/dashboard.module').then(m => m.DashboardModule)
  // }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
