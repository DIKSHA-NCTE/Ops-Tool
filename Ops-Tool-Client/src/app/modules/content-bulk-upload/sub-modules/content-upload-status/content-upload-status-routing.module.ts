import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NTPCONSTANTS } from 'src/app/constants';
import { AuthGuard } from 'src/app/helpers/guards/authGuard';
import { ListComponent } from './components/list/list.component';

const routes: Routes = [
  {
    path: NTPCONSTANTS.ROUTERLINKS.CONTENTS_BULK_UPLOAD.UPLOAD_STATUS, component: ListComponent,
    data: {
      breadcrumb: [
        {
          label: '<i class="material-icons">home</i>',
          url: '/dashboard',
          active: false
        }, {
          label: 'Contents Bulk Upload',
          url: '/contents/bulk-upload/list',
          active: false
        },
        {
          label: 'Content Upload Status',
          url: '/contents/bulk-upload/upload-status',
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

export class ContentUploadStatusRoutingModule { }
