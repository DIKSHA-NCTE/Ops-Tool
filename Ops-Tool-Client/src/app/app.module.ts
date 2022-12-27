import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './modules/core/core.module';
import { SharedModule } from './modules/shared/shared.module';
import { AdminModule } from './modules/admin/admin.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import {ContentsModule} from './modules/contents/contents.module';
import { OrganizationsModule } from './modules/organizations/organizations.module';
import { ListOrganizationsModule } from './modules/organizations/sub-modules/list-organizations/list-organizations.module';
import { CreateOrganizationsModule } from './modules/organizations/sub-modules/create-organizations/create-organizations.module';
import { UpdateOrganizationsModule } from './modules/organizations/sub-modules/update-organizations/update-organizations.module';
import { UsersModule } from './modules/users/users.module';
import { ListUsersModule } from './modules/users/sub-modules/list-users/list-users.module';
import { CreateUsersModule } from './modules/users/sub-modules/create-users/create-users.module';
import { ReportsModule } from './modules/reports/reports.module';
import { CourseModule } from './modules/course/course.module';
import { SelfSignupUsersModule } from './modules/self-signup-users/self-signup-users.module';
import { UserBulkUploadModule } from './modules/user-bulk-upload/user-bulk-upload.module';
import { UploadUserModule } from './modules/user-bulk-upload/sub-modules/upload-user/upload-user.module';
import { UserUploadStatusModule } from './modules/user-bulk-upload/sub-modules/user-upload-status/user-upload-status.module';
import { UserBatchUploadListModule } from './modules/user-bulk-upload/sub-modules/user-batch-upload-list/user-batch-upload-list.module';
import { CertificatesModule } from './modules/certificates/certificates.module';
import { UserCertificatesModule } from './modules/certificates/sub-modules/user-certificates/user-certificates.module';
import { CourseCertificatesModule } from './modules/certificates/sub-modules/course-certificates/course-certificates.module';
import { ContentBulkUploadModule } from './modules/content-bulk-upload/content-bulk-upload.module';
import { UploadContentModule } from './modules/content-bulk-upload/sub-modules/upload-content/upload-content.module';
import { ContentUploadStatusModule } from './modules/content-bulk-upload/sub-modules/content-upload-status/content-upload-status.module';
import { ContentBatchUploadListModule } from './modules/content-bulk-upload/sub-modules/content-batch-upload-list/content-batch-upload-list.module';
import { BroadcastContentsModule } from './modules/broadcast-contents/broadcast-contents.module';
import { UploadContentModule as UploadBroadcastContentModule } from './modules/broadcast-contents/sub-modules/upload-content/upload-content.module';
import { ContentUploadStatusModule as BroadcastUploadStatus } from './modules/broadcast-contents/sub-modules/content-upload-status/content-upload-status.module';
import { BroadcastBatchUploadListModule } from './modules/broadcast-contents/sub-modules/broadcast-batch-upload-list/broadcast-batch-upload-list.module';
import { ShallowCopyModule } from './modules/shallow-copy/shallow-copy.module';
import { ShallowCopyUploadModule } from './modules/shallow-copy/sub-modules/shallow-copy-upload/shallow-copy-upload.module';
import { ShallowCopyStatusModule } from './modules/shallow-copy/sub-modules/shallow-copy-status/shallow-copy-status.module';
import { ShallowCopyBatchListModule } from './modules/shallow-copy/sub-modules/shallow-copy-batch-list/shallow-copy-batch-list.module';
import { FormsModule } from './modules/forms/forms.module'
import { SubroleModule } from './modules/sub-role/sub-role.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    CoreModule,
    SharedModule,
    DashboardModule,
    AdminModule,
    ContentsModule,
    OrganizationsModule,
    ListOrganizationsModule,
    CreateOrganizationsModule,
    UpdateOrganizationsModule,
    UsersModule,
    ListUsersModule,
    CreateUsersModule,
    ReportsModule,
    CourseModule,
    SelfSignupUsersModule,
    UserBulkUploadModule,
    UploadUserModule,
    UserUploadStatusModule,
    UserBatchUploadListModule,
    CertificatesModule,
    UserCertificatesModule,
    CourseCertificatesModule,
    ContentBulkUploadModule,
    UploadContentModule,
    ContentUploadStatusModule,
    ContentBatchUploadListModule,
    BroadcastContentsModule,
    UploadBroadcastContentModule,
    BroadcastUploadStatus,
    BroadcastBatchUploadListModule,
    ShallowCopyModule,
    ShallowCopyUploadModule,
    ShallowCopyStatusModule,
    ShallowCopyBatchListModule,
    FormsModule,
    SubroleModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
