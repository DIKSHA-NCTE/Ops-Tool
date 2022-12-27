import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { TableComponent } from './components/table/table.component';
import { AuthGuard } from 'src/app/helpers/guards/authGuard';
import { ErrorCatchingInterceptor } from 'src/app/helpers/services/core/httpInterceptor.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { ReactiveFormsModule } from '@angular/forms';
import { ToasterComponent } from './components/toaster/toaster.component';
import { LoaderComponent } from './components/loader/loader.component';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SelectSearchComponent } from './components/select-search/select-search.component';
import { SelectAutocompleteModule } from 'mat-select-autocomplete';
import { TenantsService } from 'src/app/helpers/services/tenants/tenants.service';
import { InputFieldComponent } from './components/input-field/input-field.component';
import { DateRangePickerComponent } from './components/date-range-picker/date-range-picker.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { SharedService } from 'src/app/helpers/services/shared/shared.service';
import { CdkColumnDef, CdkTableModule } from '@angular/cdk/table';
import { FormsService } from 'src/app/helpers/services/forms/forms.service';
import { DownloadExcelComponent } from './components/download-excel/download-excel.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import {MatTabsModule} from '@angular/material/tabs';
import { CardComponent } from './components/card/card.component';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatDividerModule} from '@angular/material/divider';
import { PopupComponent } from './components/popup/popup.component';
import { FileComponent } from './components/file/file.component';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { ClipboardModule } from '@angular/cdk/clipboard';

@NgModule({
  declarations: [
    TableComponent,
    ToasterComponent,
    LoaderComponent,
    SelectSearchComponent,
    InputFieldComponent,
    DateRangePickerComponent,
    DownloadExcelComponent,
    CardComponent,
    PopupComponent,
    FileComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    MatTableModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatInputModule,
    MatCardModule,
    MatIconModule,
    MatDialogModule,
    MatButtonModule,
    MatSelectModule,
    MatCheckboxModule,
    MatSnackBarModule,
    SelectAutocompleteModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    CdkTableModule,
    MatTooltipModule,
    MatTabsModule,
    MatProgressBarModule,
    MatDividerModule,
    NgxJsonViewerModule,
    ClipboardModule
  ],
  exports: [
    TableComponent,
    HttpClientModule,
    MatTableModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatInputModule,
    MatCardModule,
    MatDialogModule,
    MatRadioModule,
    ReactiveFormsModule,
    TableComponent,
    ToasterComponent,
    LoaderComponent,
    MatIconModule,
    MatDialogModule,
    MatButtonModule,
    MatSelectModule,
    MatCheckboxModule,
    MatSnackBarModule,
    SelectAutocompleteModule,
    SelectSearchComponent,
    InputFieldComponent,
    ReactiveFormsModule,
    DateRangePickerComponent,
    MatDatepickerModule,
    MatNativeDateModule,
    CdkTableModule,
    MatTooltipModule,
    MatTabsModule,
    MatProgressBarModule,
    MatDividerModule,
    FileComponent,
    NgxJsonViewerModule
  ],
  providers: [AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorCatchingInterceptor,
      multi: true
    },
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, 
      useValue: { appearance: 'standard' }
    },
    TenantsService,
    SharedService,
    DatePipe,
    CdkColumnDef,
    FormsService
  ]
})
export class SharedModule { }
