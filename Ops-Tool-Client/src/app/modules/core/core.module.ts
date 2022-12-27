import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppHeaderComponent } from './components/app-header/app-header.component';
import { BreadcrumbsComponent } from './components/breadcrumbs/breadcrumbs.component';
import { RouterModule } from '@angular/router';
import { TokensComponent } from './components/tokens/tokens.component';
import { SharedModule } from '../shared/shared.module';
import { AuthenticationService } from 'src/app/helpers/services/authentication/authentication.service';

@NgModule({
  declarations: [
    AppHeaderComponent,
    BreadcrumbsComponent,
    TokensComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule
  ],
  providers: [AuthenticationService],
  exports: [
    AppHeaderComponent,
    BreadcrumbsComponent
  ]
})
export class CoreModule { }
