import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SelfSignupUsersService } from 'src/app/helpers/services/self-signup-users/self-signup-users.service';
import { SharedService } from 'src/app/helpers/services/shared/shared.service';
import { LoaderService } from 'src/app/helpers/utils/loader.service';
import { MessageService } from 'src/app/helpers/services/core/message.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  tenantsList: any = [];
  selfSignupUsersForm!: FormGroup;
  slug: any = [];
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

  constructor(
    private _fb: FormBuilder,
    private _shared: SharedService,
    private _selfSignupUsers: SelfSignupUsersService,
    private _loader: LoaderService,
    public _message: MessageService,
  ) {
    this._shared.emitResetStatus(true);
  }

  ngOnInit(): void {
    this._loader.emitLoaderStatus(true);
    this.getSearchForm();
    this.payload = {};
    this.selfSignupUsersForm = this._fb.group({
      slug: ['', Validators.required]
    });
    this._loader.emitLoaderStatus(false);
  }

  getSearchForm() {
    this._selfSignupUsers.getSsuFilter().subscribe((resp: any) => {
      if(resp.statusCode == 200 && resp.response.length > 0){
        this.filterFields = resp.response;
      }
    })
  }

  onChangeHandler = (val: any) => {
    if (val.dataType == 'array' && val.value.length > 0) {
      this.payload[`${val.property}`] = [val.value.toString().trim()];
      this.selfSignupUsersForm.patchValue({
        [val.property]: [val.value.toString().trim()],
      });
    } else if (
      typeof val.value == 'object' &&
      val.dataType == 'string' &&
      val.value != null
    ) {
      this.payload[`${val.property}`] = val.value;
      this.selfSignupUsersForm.patchValue({ [val.property]: val.value });
    } else if (
      val.dataType == 'string' &&
      val.value != '' &&
      val.value != null
    ) {
      this.payload[`${val.property}`] = val.value.trim();
      this.selfSignupUsersForm.patchValue({ [val.property]: val.value.trim() });
    } else {
      delete this.payload[`${val.property}`];
      this.selfSignupUsersForm.patchValue({ [val.property]: '' });
    }
  };

  searchselfSignupUsers() {
    this._loader.emitLoaderStatus(true);
    let isLoading = true;
    let request = {
      slug: this.payload['slug'].toString()
    };
    setTimeout(() => {
      if(isLoading == true) {
        isLoading = false
        this._message.invoke("Sit back and relax, we're preparing your download...", '', { duration: 6000 });
      }
    }, 5000)
    this._selfSignupUsers.getSelfSignupUsersList(request).subscribe((result: any) => {
      if (result.statusCode == 200) {
        this._loader.emitLoaderStatus(false);
        isLoading = false
        const a = document.createElement('a');
          a.href = result.url;
          a.download = result.url.split('/')[2];
          a.click();
          window.URL.revokeObjectURL(a.href);
          a.remove();
    //     var link = document.createElement("a");  
    // link.setAttribute('download', result.url.split('/')[2]);
    // link.href = result.url;
    // document.body.appendChild(link);
    // link.click();
    // link.remove();
      }
    },
    (error: any) => {
      this._loader.emitLoaderStatus(false);
      isLoading = false
      this._message.invoke("File doesn't exist");
    }
  );
  }

  resetForm() {
    this.payload = {};
    this.selfSignupUsersForm.reset();
    this._shared.emitResetStatus({ status: true, type: 'all' });
    this.tableData = [];
  }

  clearFields(key: any) {
    this.resetKey = { [key.key]: key.value };
    delete this.payload[`${key.key}`];
    this.selfSignupUsersForm.patchValue({ [key.key]: '' });
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
