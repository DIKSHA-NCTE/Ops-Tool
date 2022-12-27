import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ShallowCopyService } from 'src/app/helpers/services/shallow-copy/shallow-copy.service';
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
  shallowCopyBatchUploadListForm!: FormGroup;
  batchStatus: any = [];
  channel: any = [];
  userInfo: any = [];
  processId: any = [];
  channelId: any = [];
  userId: any = [];
  frameworkId: any = [];
  createdAt: any = [];
  status: any = [];
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
      cell: (element: any) => `${element.createdAt}`,
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
    private _shallowCopy: ShallowCopyService,
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
    this.shallowCopyBatchUploadListForm = this._fb.group({
      channel: [''],
      userInfo: '',
      batchStatus: ''
    }, { validator: atLeastOneValidator() });
    this._loader.emitLoaderStatus(false);
  }

  getSearchForm() {
    this._shallowCopy.getShallowCopyBatchUploadListFilter().subscribe((resp: any) => {
      if(resp.statusCode == 200 && resp.response.length > 0){
        this.filterFields = resp.response;
      }
    })
  }

  onChangeHandler = (val: any) => {
    if (val.dataType == 'array' && val.value.length > 0) {
      this.payload[`${val.property}`] = [val.value.toString().trim()];
      this.shallowCopyBatchUploadListForm.patchValue({
        [val.property]: [val.value.toString().trim()],
      });
    } else if (
      typeof val.value == 'object' &&
      val.dataType == 'string' &&
      val.value != null
    ) {
      this.payload[`${val.property}`] = val.value;
      this.shallowCopyBatchUploadListForm.patchValue({ [val.property]: val.value });
    } else if (
      val.dataType == 'string' &&
      val.value != '' &&
      val.value != null
    ) {
      this.payload[`${val.property}`] = val.value.trim();
      this.shallowCopyBatchUploadListForm.patchValue({ [val.property]: val.value.trim() });
    } else {
      delete this.payload[`${val.property}`];
      this.shallowCopyBatchUploadListForm.patchValue({ [val.property]: '' });
    }
  };

  batchUploadList() {
    this._loader.emitLoaderStatus(true);
    let request = this.payload
      this._shallowCopy.getBatchUploadList(request).subscribe((result: any) => {
        if (result.status == 200 && result.response.length > 0) {
          this.tableData = [];
          result.response.map((element: any) => {
            this.tableData.push({
              processId: element.processId,
              channelId: element.channelId,
              creator_userId: element.userId,
              creator_userName: element.userInfo,
              status: element.status,
              frameworkId: element.frameworkId,
              createdAt: this.datepipe.transform(
                element.createdAt,
                "dd/MM/yyyy h:mm a"
              ),
              updatedAt: element.updatedAt ? this.datepipe.transform(
                element.updatedAt,
                "dd/MM/yyyy h:mm a"
              ) : '',
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
    this.shallowCopyBatchUploadListForm.reset();
    this._shared.emitResetStatus({ status: true, type: 'all' });
    this.tableData = [];
  }

  clearFields(key: any) {
    this.resetKey = { [key.key]: key.value };
    delete this.payload[`${key.key}`];
    this.shallowCopyBatchUploadListForm.patchValue({ [key.key]: '' });
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
