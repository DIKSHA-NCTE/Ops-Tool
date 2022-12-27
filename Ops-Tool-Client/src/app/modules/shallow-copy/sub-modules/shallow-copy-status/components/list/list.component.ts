import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ShallowCopyService } from 'src/app/helpers/services/shallow-copy/shallow-copy.service';
import { SharedService } from 'src/app/helpers/services/shared/shared.service';
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
  shallowCopyUploadStatusForm!: FormGroup;
  batch_processId: any;
  content_identifier: any;
  failure_reason: any;
  userName: any;
  channelId: any;
  Board: any;
  Medium: any;
  Grade: any;
  Subject: any;
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
      columnDef: 'Shallow Copy ID',
      header: 'Shallow Copy ID',
      cell: (element: any) => `${element.content_identifier}`,
      styles: { 'font-size.px': 12, color: '#333' },
    },
    {
      columnDef: 'Content Origin ID',
      header: 'Content Origin ID',
      cell: (element: any) => `${element.contentOrigin}`,
      styles: { 'font-size.px': 12, color: '#333' },
    },
    {
      columnDef: 'Publish Status',
      header: 'Publish Status',
      cell: (element: any) => `${element.publishStatus}`,
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
    private _shallowCopy: ShallowCopyService,
    private _loader: LoaderService,
    public _message: MessageService,
  ) {
    this._shared.emitResetStatus(true);
  }

  ngOnInit(): void {
    this._loader.emitLoaderStatus(true);
    this.getSearchForm();
    this.payload = {};
    this.shallowCopyUploadStatusForm = this._fb.group({
      channel: [''],
      userInfo: '',
      processId: '',
      contentStatus: ['']
    }, { validator: atLeastOneValidator() });
    this._loader.emitLoaderStatus(false);
  }

  getSearchForm() {
    this._shallowCopy.getShallowCopyUploadStatusFilter().subscribe((resp: any) => {
      if(resp.statusCode == 200 && resp.response.length > 0){
        this.filterFields = resp.response;
      }
    })
  }

  onChangeHandler = (val: any) => {
    if (val.dataType == 'array' && val.value.length > 0) {
      this.payload[`${val.property}`] = [val.value.toString().trim()];
      this.shallowCopyUploadStatusForm.patchValue({
        [val.property]: [val.value.toString().trim()],
      });
    } else if (
      typeof val.value == 'object' &&
      val.dataType == 'string' &&
      val.value != null
    ) {
      this.payload[`${val.property}`] = val.value;
      this.shallowCopyUploadStatusForm.patchValue({ [val.property]: val.value });
    } else if (
      val.dataType == 'string' &&
      val.value != '' &&
      val.value != null
    ) {
      this.payload[`${val.property}`] = val.value.trim();
      this.shallowCopyUploadStatusForm.patchValue({ [val.property]: val.value.trim() });
    } else {
      delete this.payload[`${val.property}`];
      this.shallowCopyUploadStatusForm.patchValue({ [val.property]: '' });
    }
  };

  shallowCopyUploadStatus() {
    this._loader.emitLoaderStatus(true);
    this.payload.checkStatus = "contents"
    let request = this.payload
      this._shallowCopy.getShallowCopyUploadStatus(request).subscribe((result: any) => {
        if (result.status == 200 && result.response.length > 0) {
          this.tableData = [];
          result.response.map((element: any) => {
            this.tableData.push({
              'Content Origin ID': element.contentOrigin,
              Board: element.Board,
              Medium: element.Medium,
              Grade: element.Grade,
              Subject: element.Subject,
              'Shallow Copy ID': element.content_identifier,
              'Created By': element.userName,
              Channel: element.channelId,
              'Process ID': element.batch_processId,
              Status: element.status,
              'Failure Reason': element.failure_reason,
              'Publish Status': element.publishStatus
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
    this.shallowCopyUploadStatusForm.reset();
    this._shared.emitResetStatus({ status: true, type: 'all' });
    this.tableData = [];
  }

  clearFields(key: any) {
    this.resetKey = { [key.key]: key.value };
    delete this.payload[`${key.key}`];
    this.shallowCopyUploadStatusForm.patchValue({ [key.key]: '' });
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
