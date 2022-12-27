import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UsersBulkUploadService } from 'src/app/helpers/services/users-bulk-upload/users-bulk-upload.service';
import { SharedService } from 'src/app/helpers/services/shared/shared.service';
import { DatePipe } from '@angular/common';
import { LoaderService } from 'src/app/helpers/utils/loader.service';
import { MessageService } from 'src/app/helpers/services/core/message.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  tenantsList: any = [];
  userUploadStatusForm!: FormGroup;
  username: any = [];
  id: any = [];
  loginId: any = [];
  email: any = [];
  firstName: any = [];
  userName: any = [];
  organisationId: any = [];
  roles: any = [];
  userType: any = [];
  orgName: any = [];
  createdBy: any = [];
  succ_msg: any = [];
  err_msg: any = [];
  colour: any = '';
  reports: any = [];
  tableData: any = [];
  payload: any = {};
  columnsToBeDisplayed = [
    {
      columnDef: 'User ID',
      header: 'User ID',
      cell: (element: any) => `${element.userId}`,
      styles: { 'font-size.px': 12.5, color: '#172c28' },
    },
    {
      columnDef: 'First Name',
      header: 'Name',
      cell: (element: any) => `${element.firstName}`,
      styles: { 'font-size.px': 12, color: '#333' },
    },
    {
      columnDef: 'Username',
      header: 'Username',
      cell: (element: any) => `${element.userName}`,
      styles: { 'font-size.px': 12, color: '#333' },
    },
    {
      columnDef: 'Roles',
      header: 'Roles',
      cell: (element: any) => `${element.roles}`,
      styles: { 'font-size.px': 12, color: '#333' },
    },
    {
      columnDef: 'User Type',
      header: 'User Type',
      cell: (element: any) => `${JSON.parse(element.profileUserType).type}`,
      styles: { 'font-size.px': 12, color: '#333' },
    },
    {
      columnDef: 'Organisation Name',
      header: 'Organisation Name',
      cell: (element: any) => `${element.orgName}`,
      styles: { 'font-size.px': 12, color: '#333' },
    },
    {
      columnDef: 'Status',
      header: 'Status',
      cell: (element: any) => `${element.status}`,
      styles: { 'font-size.px': 12, color: this.colour, 'font-weight': 'bold' }
    }
  ];
  filterFields = [];
  keywords: any = [];
  resetKey: any;

  constructor(
    private _fb: FormBuilder,
    private _shared: SharedService,
    private _userUploadStatus: UsersBulkUploadService,
    private _loader: LoaderService,
    public _message: MessageService,
    private datepipe: DatePipe
  ) {
    this._shared.emitResetStatus(true);
  }

  ngOnInit(): void {
    this._loader.emitLoaderStatus(true);
    this.getSearchForm();
    this.payload = {};
    this.userUploadStatusForm = this._fb.group({
      username: ['', Validators.required],
      id: ['', Validators.required]
    });
    this._loader.emitLoaderStatus(false);
  }

  getSearchForm() {
    this._userUploadStatus.getUserUploadStatusFilter().subscribe((resp: any) => {
      if(resp.statusCode == 200 && resp.response.length > 0){
        this.filterFields = resp.response;
      }
    })
  }

  onChangeHandler = (val: any) => {
    if (val.dataType == 'array' && val.value.length > 0) {
      this.payload[`${val.property}`] = [val.value.toString().trim()];
      this.userUploadStatusForm.patchValue({
        [val.property]: [val.value.toString().trim()],
      });
    } else if (
      typeof val.value == 'object' &&
      val.dataType == 'string' &&
      val.value != null
    ) {
      this.payload[`${val.property}`] = val.value;
      this.userUploadStatusForm.patchValue({ [val.property]: val.value });
    } else if (
      val.dataType == 'string' &&
      val.value != '' &&
      val.value != null
    ) {
      this.payload[`${val.property}`] = val.value.trim();
      this.userUploadStatusForm.patchValue({ [val.property]: val.value.trim() });
    } else {
      delete this.payload[`${val.property}`];
      this.userUploadStatusForm.patchValue({ [val.property]: '' });
    }
  };

  userUploadStatus() {
    this.tableData = [];
    this.reports = [];
    this._loader.emitLoaderStatus(true);
    let request = {
      metaInfo : JSON.stringify({ userName: this.payload.username }),
      id: this.payload.id
    };
    this._userUploadStatus.getUserUploadStatus(request).subscribe((result: any) => {
      if (result.statusCode == 200) {
        if (result.existingUserCsv !== undefined) {
          this.reports.push(result.existingUserCsv);
        }
        if (result.invalidNewUsersCsv !== undefined) {
          this.reports.push(result.invalidNewUsersCsv);
        }
        if (result?.response?.result?.response[0]?.failureResult?.length > 0) {
          result.response.result.response[0].failureResult.map((element: any) => {
            this.tableData.push({
              'User ID': element.userId ? element.userId : '',
              Username: element.userName ? element.userName : '',
              Email: element.email ? element.email : '',
              Phone: element.phone ? element.phone : '',
              'First Name': element.firstName,
              'Last Name': element.lastName ? element.lastName : '',
              'Organisation Id': element.orgId,
              'Organisation Name': element.orgName ? element.orgName : '',
              Roles: element.roles.toString(),
              'Created By': element.createdBy ? element.createdBy : '',
              'Created Date': element.createdDate ? this.datepipe.transform(
                element.createdDate,
                "dd/MM/yyyy h:mm a"
              ) : '',
              'User Type': (element.profileUserType !== undefined ? JSON.parse(element.profileUserType).type : (element.userType ? element.userType : '')),
              Status: 'User not created. ' + element.err_msg
            });
            this.colour = '##AF0606'
          });
      }
        if (result?.response?.result?.response[0]?.successResult?.length > 0) {
          result.response.result.response[0].successResult.map((element: any) => {
            this.tableData.push({
              'User ID': element.userId ? element.userId : '',
              Username: element.userName ? element.userName : '',
              Email: element.email,
              Phone: element.phone ? element.phone : '',
              'First Name': element.firstName,
              'Last Name': element.lastName ? element.lastName : '',
              'Organisation Id': element.orgId,
              'Organisation Name': element.orgName,
              Roles: element.roles.toString(),
              'User Type': element.profileUserType ? JSON.parse(element.profileUserType).type : (element.userType ? element.userType : ''),
              'Created By': element.createdBy,
              'Created Date': element.createdDate ? this.datepipe.transform(
                element.createdDate,
                "dd/MM/yyyy h:mm a"
              ) : '',
              Status: 'User Created'
            });
            this.colour = '#4BB543'
          });
      }
      this._loader.emitLoaderStatus(false);
        } else if (result.statusCode == 400) {
          this.tableData = [];
          this.reports = [];
          this._loader.emitLoaderStatus(false);
          this._message.invoke("You are not authorized.");
        } else {
          this.tableData = [];
          this.reports = [];
          this._loader.emitLoaderStatus(false);
          this._message.invoke("No records found.");
        }
    },
    (error: any) => {
      this.tableData = [];
      this.reports = [];
      this._loader.emitLoaderStatus(false);
      this._message.invoke("Something went wrong. Please, try again.");
    }
    );
  }

  resetForm() {
    this.payload = {};
    this.userUploadStatusForm.reset();
    this._shared.emitResetStatus({ status: true, type: 'all' });
    this.tableData = [];
  }

  clearFields(key: any) {
    this.resetKey = { [key.key]: key.value };
    delete this.payload[`${key.key}`];
    this.userUploadStatusForm.patchValue({ [key.key]: '' });
    this._shared.emitResetStatus({
      status: true,
      type: key.key,
      value: key.value,
    });
  }

  getKeyValueTypes(key: any) {
    if (typeof key.value == 'object') {
    }
    return key.value;
  }
}
