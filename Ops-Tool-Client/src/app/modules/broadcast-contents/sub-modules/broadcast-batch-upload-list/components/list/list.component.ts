import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BroadcastContentUploadService } from 'src/app/helpers/services/broadcast-content-upload/broadcast-content-upload.service';
import { DatePipe } from '@angular/common';
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
  broadcastBatchUploadListForm!: FormGroup;
  batchStatus: any = [];
  channel: any = [];
  userInfo: any = [];
  processId: any = [];
  channelId: any = [];
  userId: any = [];
  email: any = [];
  frameworkId: any = [];
  createdAt: any = [];
  status: any = [];
  startTime: any;
  tableData: any = [];
  payload: any = {};
  columnsToBeDisplayed = [
    {
      columnDef: 'processId',
      header: 'Process ID',
      cell: (element: any) => `${element.batchId}`,
      styles: { 'font-size.px': 12.5, color: '#172c28' },
    },
    {
      columnDef: 'channelId',
      header: 'Channel ID',
      cell: (element: any) => `${element.processId}`,
      styles: { 'font-size.px': 12, color: '#333' },
    },
    {
      columnDef: 'userId',
      header: 'User ID',
      cell: (element: any) => `${element.channelId}`,
      styles: { 'font-size.px': 12, color: '#333' },
    },
    {
      columnDef: 'createdAt',
      header: 'Created At',
      cell: (element: any) => `${element.adminEmail}`,
      styles: { 'font-size.px': 12, color: '#333' },
    },
    {
      columnDef: 'status',
      header: 'Status',
      cell: (element: any) => `${element.status}`,
      styles: { 'font-size.px': 12, color: '#333' },
    }
  ];
  filterFields = [];
  keywords: any = [];
  resetKey: any;

  constructor(
    private _fb: FormBuilder,
    private _shared: SharedService,
    private _broadcastBatchUploadList: BroadcastContentUploadService,
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
    this.broadcastBatchUploadListForm = this._fb.group({
      channel: [''],
      userInfo: '',
      batchStatus: ''
    }, { validator: atLeastOneValidator() });
    this._loader.emitLoaderStatus(false);
  }

  getSearchForm() {
    this._broadcastBatchUploadList.getBroadcastBatchUploadListFilter().subscribe((resp: any) => {
      if(resp.statusCode == 200 && resp.response.length > 0){
        this.filterFields = resp.response;
      }
    })
  }

  onChangeHandler = (val: any) => {
    if (val.dataType == 'array' && val.value.length > 0) {
      this.payload[`${val.property}`] = [val.value.toString().trim()];
      this.broadcastBatchUploadListForm.patchValue({
        [val.property]: [val.value.toString().trim()],
      });
    } else if (
      typeof val.value == 'object' &&
      val.dataType == 'string' &&
      val.value != null
    ) {
      this.payload[`${val.property}`] = val.value;
      this.broadcastBatchUploadListForm.patchValue({ [val.property]: val.value });
    } else if (
      val.dataType == 'string' &&
      val.value != '' &&
      val.value != null
    ) {
      this.payload[`${val.property}`] = val.value.trim();
      this.broadcastBatchUploadListForm.patchValue({ [val.property]: val.value.trim() });
    } else {
      delete this.payload[`${val.property}`];
      this.broadcastBatchUploadListForm.patchValue({ [val.property]: '' });
    }
  };

  batchUploadList() {
    this._loader.emitLoaderStatus(true);
    let request = this.payload
      this._broadcastBatchUploadList.getBatchUploadList(request).subscribe((result: any) => {
        if (result.status == 200 && result.response.length > 0) {
          this.tableData = [];
          result.response.map((element: any) => {
            this.tableData.push({
              processId: element.processId,
              channelId: element.channelId,
              creator_userId: element.userId,
              creator_username: element.userInfo,
              status: element.status,
              frameworkId: element.frameworkId,
              createdAt: this.datepipe.transform(
                element.createdAt,
                "dd/MM/yyyy h:mm a"
              ),
              startTime: this.datepipe.transform(
                element.startTime,
                "dd/MM/yyyy h:mm a"
              ),
              executor_userId: (element.executor_info && element.executor_info !== null) ? element.executor_info : ''
            });
          });
          this._loader.emitLoaderStatus(false);
        } else {
          this.tableData = [];
          this._loader.emitLoaderStatus(false);
          this._message.invoke("No records found.");
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
    this.broadcastBatchUploadListForm.reset();
    this._shared.emitResetStatus({ status: true, type: 'all' });
    this.tableData = [];
  }

  clearFields(key: any) {
    this.resetKey = { [key.key]: key.value };
    delete this.payload[`${key.key}`];
    this.broadcastBatchUploadListForm.patchValue({ [key.key]: '' });
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
