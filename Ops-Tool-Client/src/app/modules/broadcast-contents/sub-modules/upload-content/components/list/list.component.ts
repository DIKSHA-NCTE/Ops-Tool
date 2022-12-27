import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BroadcastContentUploadService } from 'src/app/helpers/services/broadcast-content-upload/broadcast-content-upload.service';
import { SharedService } from 'src/app/helpers/services/shared/shared.service';
import { LoaderService } from 'src/app/helpers/utils/loader.service';
import { MessageService } from 'src/app/helpers/services/core/message.service';
import { UsersService } from 'src/app/helpers/services/users/users.service';
import { MatDialog } from '@angular/material/dialog';
import {Clipboard} from '@angular/cdk/clipboard';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  tenantsList: any = [];
  broadcastUploadForm!: FormGroup;
  id: any = [];
  usersearchType: any = [];
  userInfo: any;
  frameworkId: any;
  file: any;
  tableData: any = [];
  payload: any = {};
  columnsToBeDisplayed = [
    {
      columnDef: 'courseId',
      header: 'Course ID',
      cell: (element: any) => `${element.courseId}`,
      styles: { 'font-size.px': 12.5, color: '#172c28' },
    },
    {
      columnDef: 'courseName',
      header: 'Course Name',
      cell: (element: any) => `${element.courseName}`,
      styles: { 'font-size.px': 12, color: '#333' },
    },
    {
      columnDef: 'batchId',
      header: 'Batch ID',
      cell: (element: any) => `${element.batchId}`,
      styles: { 'font-size.px': 12, color: '#333' },
    },
    {
      columnDef: 'createdOn',
      header: 'Created On',
      cell: (element: any) => `${element.createdOn}`,
      styles: { 'font-size.px': 12, color: '#333' },
    },
    {
      columnDef: 'createdFor',
      header: 'Created For',
      cell: (element: any) => `${element.createdFor}`,
      styles: { 'font-size.px': 12, color: '#333' },
    },
    {
      columnDef: 'createdBy',
      header: 'Created By',
      cell: (element: any) => `${element.createdBy}`,
      styles: { 'font-size.px': 12, color: '#333' },
    },
    {
      columnDef: 'startDate',
      header: 'Start Date',
      cell: (element: any) => `${element.startDate}`,
      styles: { 'font-size.px': 12, color: '#333' },
    },
    {
      columnDef: 'enrollmentEndDate',
      header: 'Enrollment End Date',
      cell: (element: any) => `${element.enrollmentEndDate}`,
      styles: { 'font-size.px': 12, color: '#333' },
    },
    {
      columnDef: 'enrollmentType',
      header: 'Enrollment Type',
      cell: (element: any) => `${element.enrollmentType}`,
      styles: { 'font-size.px': 12, color: '#333' },
    },
    {
      columnDef: 'endDate',
      header: 'End Date',
      cell: (element: any) => `${element.endDate}`,
      styles: { 'font-size.px': 12, color: '#333' },
    },
    {
      columnDef: 'status',
      header: 'Status',
      cell: (element: any) => `${element.status}`,
      styles: { 'font-size.px': 12, color: '#333' },
    },
    {
      columnDef: 'action',
      header: 'Action',
      cell: (element: any) => `${element.action}`,
      styles: { 'font-size.px': 12, color: '#333' },
    },
  ];
  filterFields = [];
  keywords: any = [];
  resetKey: any;
  fileName: any;
  dialogRef: any;
  filters: any = {};
  @ViewChild('popupTemplate') popupDialog!: TemplateRef<any>;
  processId: string = '';

  constructor(
    private _fb: FormBuilder,
    private _shared: SharedService,
    private _broadcastUpload: BroadcastContentUploadService,
    private _user: UsersService,
    private _loader: LoaderService,
    public _message: MessageService,
    public dialog: MatDialog,
    private clipboard: Clipboard
  ) {
    this._shared.emitResetStatus(true);
  }

  ngOnInit(): void {
    this._loader.emitLoaderStatus(true);
    this.getSearchForm();
    this.payload = {};
    this.broadcastUploadForm = this._fb.group({
      id: ['', Validators.required],
      frameworkId: ['', Validators.required],
      usersearchType: ['', Validators.required],
      userInfo: ['', Validators.required],
      file: ['', Validators.required]
    });
    this._loader.emitLoaderStatus(false);
  }

  getSearchForm() {
    this._broadcastUpload.getBroadcastUploadFilter().subscribe((resp: any) => {
      if(resp.statusCode == 200 && resp.response.length > 0){
        this.filterFields = resp.response;
      }
    })
  }

  onChangeHandler = (val: any) => {
    if (val.dataType == 'array' && val.value.length > 0) {
      this.payload[`${val.property}`] = [val.value.toString().trim()];
      this.broadcastUploadForm.patchValue({
        [val.property]: [val.value.toString().trim()],
      });
      if(val.property == 'id' && val.value.length > 0) {
        let req = {
          [val.property]: [val.value]
        }
        this._broadcastUpload.channelRead(req).subscribe((result: any) => {
          if(result.statusCode == 200 && result.response.result.channel.defaultFramework.length > 0) {
            this.payload.frameworkId = result.response.result.channel.defaultFramework
            this.broadcastUploadForm.patchValue({
              frameworkId: result.response.result.channel.defaultFramework
            })
            this._shared.emitUpdateStatus({type: 'frameworkId', value: result.response.result.channel.defaultFramework})
          } else {
            this._message.invoke("Error fetching framework ID. Please, try again.");
          }
        }, (error: any) => {
          this._message.invoke("Something went wrong. Please, refresh and try again.");
        })
      }
    } else if (
      typeof val.value == 'object' &&
      val.dataType == 'string' &&
      val.value != null
    ) {
      this.payload[`${val.property}`] = val.value;
      this.broadcastUploadForm.patchValue({ [val.property]: val.value });
    } else if (
      val.dataType == 'string' &&
      val.value != '' &&
      val.value != null
    ) {
      this.payload[`${val.property}`] = val.value.trim();
      this.broadcastUploadForm.patchValue({ [val.property]: val.value.trim() });
    } else {
      delete this.payload[`${val.property}`];
      this.broadcastUploadForm.patchValue({ [val.property]: '' });
    }
  };

  getUserIdAndUserName(userInfo: any, usersearchType: any, callback: any) {
    const tempObj: any = {};
    if(usersearchType == 'Email') {
      this.filters.email = userInfo
    } else if(usersearchType == 'Username') {
      this.filters.userName = userInfo
    }
    let req = {
      'request': {
         'filters': this.filters,
         'fields': [
         ],
         'sort_by': {
            'createdDate': 'desc'
         },
         'offset': 0,
         'limit': 10000
      }
  };
    this._user.getUsersList(req).subscribe((result: any) => {
      if(result.statusCode == 200 && result.response.result.response.count > 0) {
        let name = '';
          if(result.response.result.response.content[0].lastName != null && result.response.result.response.content[0].lastName != '') {
            name = result.response.result.response.content[0].firstName + ' ' + result.response.result.response.content[0].lastName;
          } else {
            name = result.response.result.response.content[0].firstName;
          }
          tempObj['userId'] = result.response.result.response.content[0].id;
          tempObj['userName'] = result.response.result.response.content[0].userName;
          tempObj['email'] = result.response.result.response.content[0].email;
          tempObj['name'] = name;
          tempObj['userRoles'] = result.response.result.response.content[0].organisations;
          tempObj['rootOrgId'] = result.response.result.response.content[0].rootOrgId;
          tempObj['rootOrgName'] = result.response.result.response.content[0].rootOrgName;
          this.filters = {};
          callback(null, tempObj);
      } else {
        this.filters = {};
        callback('error')
      }
    }, (error: any) => {
      this.filters = {}
      this._message.invoke("Something went wrong with user search. Please, try again.");
    })
  }

  onUpload() {
    this._loader.emitLoaderStatus(true);
    let roles: any = [], userId: any = '', name: any = '', username : any = '', email : any = '',rootOrgName: any = '', info: any = {}, reqForm: any = {};
    let { id, frameworkId, usersearchType, userInfo, file } = this.payload;
    const channel = this.payload.id.toString();
    this.getUserIdAndUserName(userInfo, usersearchType[0], (err: any, result: any) => {
      if(err) {
        this._loader.emitLoaderStatus(false);
        this._message.invoke("User not found. Please, try with correct user info.");
      }
      userId = result.userId;
      name = result.name;
      username = result.userName;
      email = result.email;
      rootOrgName = result.rootOrgName;
      info = {
        'name': name, 'id': userId
      };
      if(channel == result.rootOrgId) {
        for (let i = 0; i < result.userRoles.length; i++) {
          roles.push(result.userRoles[i].roles);
        }
        if (roles[0].indexOf('CONTENT_CREATOR') > -1) {
          reqForm = {
            'frameworkId' : frameworkId,
            'channelId' : channel,
            'orgName' : rootOrgName,
            'userId' : userId,
            'userName' : username,
            'email' : email,
            'name' : name,
            'creatorInfo' : JSON.stringify(info)
          };
          let formData = new FormData();
          formData.append("frameworkId", frameworkId);
          formData.append("channelId", id);
          formData.append("userId", userId);
          formData.append('file', file, file.name);
          formData.append('metaInfo', JSON.stringify(reqForm));
          if(Object.keys(reqForm).length !== 0) {
            this.uploadContent(formData)
            }
        } else {
          this._loader.emitLoaderStatus(false);
          this._message.invoke(`Given user info doesn't have content creator rights. Kindly, provide correct user info.`);
        }
      } else {
        this._loader.emitLoaderStatus(false);
        this._message.invoke("Given user doesn't belong to selected channel. Kindly, provide correct user info.");
      }
    })
  }

  uploadContent(formData: any) {
    this._broadcastUpload.broadcastContent(formData).subscribe((result: any) => {
      if(result.status == 201 && result.response != null) {
          this.processId = result.response[0].processId;
          this._loader.emitLoaderStatus(false);
          this.dialogRef = this.dialog.open(this.popupDialog,{
            data: { 'processId': this.processId }
          });
        } else if(result.statusCode == 400) {
        this._loader.emitLoaderStatus(false);
        this._message.invoke("You are not authorized.");
      } else {
        this._loader.emitLoaderStatus(false);
        this._message.invoke("Something went wrong. Please, try again.");
      }
    },
    (error: any) => {
      this._loader.emitLoaderStatus(false);
      this._message.invoke("Something went wrong. Please, try again.");
    }
    );
  }

  resetForm() {
    this.payload = {};
    this.broadcastUploadForm.reset();
    this._shared.emitResetStatus({ status: true, type: 'all' });
    this.tableData = [];
  }

  clearFields(key: any) {
    this.resetKey = { [key.key]: key.value };
    delete this.payload[`${key.key}`];
    this.broadcastUploadForm.patchValue({ [key.key]: '' });
    this._shared.emitResetStatus({
      status: true,
      type: key.key,
      value: key.value,
    });
  }

  getKeyValueTypes(key: any) {
    if (typeof key.value == 'object') {
      return key.value.name ? key.value.name : key.value
    }
    return key.value;
  }
}
