import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UsersBulkUploadService } from 'src/app/helpers/services/users-bulk-upload/users-bulk-upload.service';
import { SharedService } from 'src/app/helpers/services/shared/shared.service';
import { LoaderService } from 'src/app/helpers/utils/loader.service';
import { MessageService } from 'src/app/helpers/services/core/message.service';
import { MatDialog } from '@angular/material/dialog';
import {Clipboard} from '@angular/cdk/clipboard';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  tenantsList: any = [];
  userUploadForm!: FormGroup;
  channel: any = [];
  adminDetails: any = [];
  user: any = [];
  tableData: any = [];
  payload: any = {};
  filterFields = [];
  keywords: any = [];
  resetKey: any;
  fileName: any;
  dialogRef: any;
  @ViewChild('popupTemplate') popupDialog!: TemplateRef<any>;
  processId: string = '';

  constructor(
    private _fb: FormBuilder,
    private _shared: SharedService,
    private _userUpload: UsersBulkUploadService,
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
    this.userUploadForm = this._fb.group({
      channel: ['', Validators.required],
      adminDetails: ['', Validators.required],
      user: ['', Validators.required]
    });
    this._loader.emitLoaderStatus(false);
  }

  getSearchForm() {
    this._userUpload.getUserUploadFilter().subscribe((resp: any) => {
      if(resp.statusCode == 200 && resp.response.length > 0){
        this.filterFields = resp.response;
      }
    })
  }

  onChangeHandler = (val: any) => {
    if (val.dataType == 'array' && val.value.length > 0) {
      this.payload[`${val.property}`] = [val.value.toString().trim()];
      this.userUploadForm.patchValue({
        [val.property]: [val.value.toString().trim()],
      });
    } else if (
      typeof val.value == 'object' &&
      val.dataType == 'string' &&
      val.value != null
    ) {
      this.payload[`${val.property}`] = val.value;
      this.userUploadForm.patchValue({ [val.property]: val.value });
    } else if (
      val.dataType == 'string' &&
      val.value != '' &&
      val.value != null
    ) {
      this.payload[`${val.property}`] = val.value.trim();
      this.userUploadForm.patchValue({ [val.property]: val.value.trim() });
    } else {
      delete this.payload[`${val.property}`];
      this.userUploadForm.patchValue({ [val.property]: '' });
    }
  };

  userUpload() {
    this._loader.emitLoaderStatus(true);
    let metaInfo: any = {
      userName: this.payload.adminDetails
    };
    let formData = new FormData();
    formData.append("channel", this.payload.channel);
    formData.append("adminDetails", this.payload.adminDetails);
    formData.append("user", this.payload.user);
    formData.append("metaInfo", JSON.stringify(metaInfo));

    this._userUpload.uploadUser(formData).subscribe((result: any) => {
      if(result.status == 200 && result.response != null) {
          this.tableData = [];
          this.processId = result.response;
          this._loader.emitLoaderStatus(false);
          this.dialogRef = this.dialog.open(this.popupDialog,{
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
      if (error.indexOf('401 Unauthorized') > -1) {
        this._loader.emitLoaderStatus(false);
        this._message.invoke("User Unauthorized. Please, try with different user.");
      } else {
        this._loader.emitLoaderStatus(false);
        this._message.invoke("Something went wrong. Please, try again.");
      }
    }
    );
  }

  resetForm() {
    this.payload = {};
    this.userUploadForm.reset();
    this._shared.emitResetStatus({ status: true, type: 'all' });
    this.tableData = [];
  }

  clearFields(key: any) {
    this.resetKey = { [key.key]: key.value };
    delete this.payload[`${key.key}`];
    this.userUploadForm.patchValue({ [key.key]: '' });
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
