import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BroadcastContentUploadService } from 'src/app/helpers/services/broadcast-content-upload/broadcast-content-upload.service';
import { SharedService } from 'src/app/helpers/services/shared/shared.service';
import { LoaderService } from 'src/app/helpers/utils/loader.service';
import { MessageService } from 'src/app/helpers/services/core/message.service';
import { environment } from 'src/environments/environment';
import { atLeastOneValidator } from 'src/app/helpers/directives/custom-validator.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  tenantsList: any = [];
  broadcastUploadStatusForm!: FormGroup;
  batch_processId: any;
  content_identifier: any;
  contentName: any;
  failure_reason: any;
  baseUrl: any = environment.PLAY_URL;
  contentDesc: any;
  ContentType: any;
  userName: any;
  channelId: any;
  Board: any;
  Medium: any;
  Grade: any;
  Subject: any;
  Topic: any;
  ResourceType: any;
  Audience: any;
  Attribution: any;
  IconPath: any;
  FilePath: any;
  Author: any;
  Copyright: any;
  CopyrightYear: any;
  License: any;
  PrimaryCategory: any;
  AdditionalCategories: any;
  tableData: any = [];
  payload: any = {};
  columnsToBeDisplayed = [
    {
      columnDef: 'Process ID',
      header: 'Process ID',
      cell: (element: any) => `${element.batch_processId}`,
      styles: { 'font-size.px': 12.5, color: '#172c28' },
    },
    {
      columnDef: 'Identifier',
      header: 'Identifier',
      cell: (element: any) => `${element.content_identifier}`,
      styles: { 'font-size.px': 12, color: '#333' },
    },
    {
      columnDef: 'Name',
      header: 'Name',
      cell: (element: any) => `${element.contentName}`,
      styles: { 'font-size.px': 12, color: '#333' },
    },
    {
      columnDef: 'Failure Reason',
      header: 'Failure Reason',
      cell: (element: any) => `${element.failure_reason}`,
      styles: { 'font-size.px': 12, color: '#333' },
    }
  ];
  filterFields = [];
  keywords: any = [];
  resetKey: any;

  constructor(
    private _fb: FormBuilder,
    private _shared: SharedService,
    private _broadcastUploadStatus: BroadcastContentUploadService,
    private _loader: LoaderService,
    public _message: MessageService,
  ) {
    this._shared.emitResetStatus(true);
  }

  ngOnInit(): void {
    this._loader.emitLoaderStatus(true);
    this.getSearchForm();
    this.payload = {};
    this.broadcastUploadStatusForm = this._fb.group({
      channel: [''],
      userInfo: '',
      processId: '',
      contentStatus: ['']
    }, { validator: atLeastOneValidator() });
    this._loader.emitLoaderStatus(false);
  }

  getSearchForm() {
    this._broadcastUploadStatus.getBroadcastUploadStatusFilter().subscribe((resp: any) => {
      if(resp.statusCode == 200 && resp.response.length > 0){
        this.filterFields = resp.response;
      }
    })
  }

  onChangeHandler = (val: any) => {
    if (val.dataType == 'array' && val.value.length > 0) {
      this.payload[`${val.property}`] = [val.value.toString().trim()];
      this.broadcastUploadStatusForm.patchValue({
        [val.property]: [val.value.toString().trim()],
      });
    } else if (
      typeof val.value == 'object' &&
      val.dataType == 'string' &&
      val.value != null
    ) {
      this.payload[`${val.property}`] = val.value;
      this.broadcastUploadStatusForm.patchValue({ [val.property]: val.value });
    } else if (
      val.dataType == 'string' &&
      val.value != '' &&
      val.value != null
    ) {
      this.payload[`${val.property}`] = val.value.trim();
      this.broadcastUploadStatusForm.patchValue({ [val.property]: val.value.trim() });
    } else {
      delete this.payload[`${val.property}`];
      this.broadcastUploadStatusForm.patchValue({ [val.property]: '' });
    }
  };

  broadcastUploadStatus() {
    this._loader.emitLoaderStatus(true);
    this.payload.checkStatus = "contents"
    let request = this.payload
      this._broadcastUploadStatus.getBroadcastUploadStatus(request).subscribe((result: any) => {
        if (result.status == 200 && result.response.length > 0) {
          this.tableData = [];
          result.response.map((element: any) => {
            this.tableData.push({
              Name: element.contentName,
              Description: element.contentDesc,
              Board: element.Board,
              Medium: element.Medium,
              Grade: element.Grade,
              Subject: element.Subject,
              Topic: element.Topic,
              'Primary Category': element.PrimaryCategory,
              'Additional Categories': element.AdditionalCategories,
              'Content Type': element.ContentType,
              'Resource Type': element.ResourceType,
              Keywords: element.keywords,
              Audience: element.Audience,
              Attribution: element.Attribution,
              'Icon Path': element.IconPath,
              'File Path': element.FilePath,
              Author: element.Author,
              Copyright: element.Copyright,
              'Copyright Year': element.CopyrightYear,
              License: element.License,
              Identifier: element.content_identifier,
              'Process ID': element.batch_processId,
              'Created By': element.userName,
              Channel: element.channelId,
              'Failure Reason': element.failure_reason,
              'Play URL': element.content_identifier ? this.baseUrl + element.content_identifier : '',
            });
          });
          delete this.payload.checkStatus
          this._loader.emitLoaderStatus(false);
        } else {
          delete this.payload.checkStatus
          this.tableData = [];
          this._loader.emitLoaderStatus(false);
          this._message.invoke("No records found.");
        }
      },
      (error: any) => {
        delete this.payload.checkStatus
        this.tableData = [];
        this._loader.emitLoaderStatus(false);
        this._message.invoke("Something went wrong. Please, try again.");
      }
      );

  }

  resetForm() {
    this.payload = {};
    this.broadcastUploadStatusForm.reset();
    this._shared.emitResetStatus({ status: true, type: 'all' });
    this.tableData = [];
  }

  clearFields(key: any) {
    this.resetKey = { [key.key]: key.value };
    delete this.payload[`${key.key}`];
    this.broadcastUploadStatusForm.patchValue({ [key.key]: '' });
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
