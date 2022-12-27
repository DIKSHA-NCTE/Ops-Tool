import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UsersService } from 'src/app/helpers/services/users/users.service';
import { SharedService } from 'src/app/helpers/services/shared/shared.service';
import { DatePipe } from '@angular/common';
import { LoaderService } from 'src/app/helpers/utils/loader.service';
import { MessageService } from 'src/app/helpers/services/core/message.service';
import { atLeastOneValidator } from 'src/app/helpers/directives/custom-validator.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  tenantsList: any = [];
  usersForm!: FormGroup;
  firstName: any = [];
  userName: any = [];
  identifier: any = [];
  rootOrgId: any = [];
  channel: any = [];
  roles: any = [];
  tableData: any = [];
  payload: any = {};
  columnsToBeDisplayed = [
    {
      columnDef: 'identifier',
      header: 'Identifier',
      cell: (element: any) => `${element.identifier}`,
      styles: { 'font-size.px': 12.5, color: '#172c28' },
    },
    {
      columnDef: 'firstName',
      header: 'Name',
      cell: (element: any) => `${element.name}`,
      styles: { 'font-size.px': 12, color: '#333' },
    },
    {
      columnDef: 'userName',
      header: 'User Name',
      cell: (element: any) => `${element.userName}`,
      styles: { 'font-size.px': 12, color: '#333' },
    },
    {
      columnDef: 'rootOrgId',
      header: 'Root Org ID',
      cell: (element: any) => `${element.orgId}`,
      styles: { 'font-size.px': 12, color: '#333' },
    },
    {
      columnDef: 'channel',
      header: 'Channel',
      cell: (element: any) => `${element.channel}`,
      styles: { 'font-size.px': 12, color: '#333' },
    },
    {
      columnDef: 'roles',
      header: 'Roles',
      cell: (element: any) => `${element.roles}`,
      styles: { 'font-size.px': 12, color: '#333' },
    },
    {
      columnDef: 'edit_user',
      header: 'Action',
      styles: { 'font-size.px': 12, color: '#333' },
    }
  ];
  filterFields = [];
  keywords: any = [];
  resetKey: any;

  constructor(
    private _fb: FormBuilder,
    private _shared: SharedService,
    private _users: UsersService,
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
    this.usersForm = this._fb.group({
      rootOrgId: [''],
      name: '',
      userId: '',
      roles: '',
      email: '',
      phone: '',
      userName: '',
    }, { validator: atLeastOneValidator() });
    if (this._shared.sharedData != undefined) {
      this.payload.userId = this._shared.sharedData;
      this.searchUsers();
      this._shared.sharedData = undefined;
      this.payload = {};
    }
    this._loader.emitLoaderStatus(false);
  }

  getSearchForm() {
    this._users.getUsersFilter().subscribe((resp: any) => {
      if(resp.statusCode == 200 && resp.response.length > 0){
        this.filterFields = resp.response;
      }
    })
  }

  onChangeHandler = (val: any) => {
    if (val.dataType == 'array' && val.value.length > 0) {
      this.payload[`${val.property}`] = [val.value.toString().trim()];
      this.usersForm.patchValue({
        [val.property]: [val.value.toString().trim()],
      });
    } else if (
      typeof val.value == 'object' &&
      val.dataType == 'string' &&
      val.value != null
    ) {
      this.payload[`${val.property}`] = val.value;
      this.usersForm.patchValue({ [val.property]: val.value });
    } else if (
      val.dataType == 'string' &&
      val.value != '' &&
      val.value != null
    ) {
      this.payload[`${val.property}`] = val.value.trim();
      this.usersForm.patchValue({ [val.property]: val.value.trim() });
    } else {
      delete this.payload[`${val.property}`];
      this.usersForm.patchValue({ [val.property]: '' });
    }
  };

  searchUsers() {
    this._loader.emitLoaderStatus(true);
    let rolesVal = ''
    if (this.payload['roles']) {
      rolesVal = this.payload['roles'];
      delete this.payload['roles']
    }
    if (this.payload['name']) {
      this.payload['firstName'] = this.payload['name']
      delete this.payload['name']
    }
    let request = {
      request: {
        filters: this.payload,
        limit: 10000,
        fields: [],
        sort_by: {
          createdDate: "desc"
        },
        query: rolesVal.toString()
      },
    };
    this._users.getUsersList(request).subscribe((result: any) => {
      if (result.statusCode == 200 && result.response.result.response.count > 0) {
        this.tableData = [];
        result.response.result.response.content.map((element: any) => {
          this.tableData.push({
            identifier: element.identifier,
            firstName: element.firstName,
            lastName: element.lastName,
            userName: element.userName,
            rootOrgId: element.rootOrgId,
            rootOrgName: element.rootOrgName,
            channel: element.channel,
            roles: element.organisations.length > 0 && element.organisations[0]['roles'] ? element.organisations[0]['roles'].toString() : '',
            createdBy: element.createdBy,
            userType: element.userType,
            createdDate: this.datepipe.transform(
              element.createdDate,
              "dd/MM/yyyy h:mm a"
            )
          });
        });
        if(rolesVal) {
          this.payload['roles'] = rolesVal
        }
        if(this.payload['firstName']) {
          this.payload['name'] = this.payload['firstName']
          delete this.payload['firstName']
        }
        this._loader.emitLoaderStatus(false);
      } else {
        if(rolesVal) {
          this.payload['roles'] = rolesVal
        }
        if(this.payload['firstName']) {
          this.payload['name'] = this.payload['firstName']
          delete this.payload['firstName']
        }
        this._loader.emitLoaderStatus(false);
        this.tableData = [];
        this._message.invoke('No records found.');
      }
    });
  }

  resetForm() {
    this.payload = {};
    this.usersForm.reset();
    this._shared.emitResetStatus({ status: true, type: 'all' });
    this.tableData = [];
  }

  clearFields(key: any) {
    this.resetKey = { [key.key]: key.value };
    delete this.payload[`${key.key}`];
    this.usersForm.patchValue({ [key.key]: '' });
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