import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CourseService } from 'src/app/helpers/services/course/course.service';
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
  courseForm!: FormGroup;
  createdFor: any = [];
  status: any = [];
  courseId: any = [];
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
      columnDef: 'startDate',
      header: 'Start Date',
      cell: (element: any) => `${element.startDate}`,
      styles: { 'font-size.px': 12, color: '#333' },
    },
    {
      columnDef: 'endDate',
      header: 'End Date',
      cell: (element: any) => `${element.endDate}`,
      styles: { 'font-size.px': 12, color: '#333' },
    },
    {
      columnDef: 'enrollmentType',
      header: 'Enrollment Type',
      cell: (element: any) => `${element.enrollmentType}`,
      styles: { 'font-size.px': 12, color: '#333' },
    },
    {
      columnDef: 'enrollmentEndDate',
      header: 'Enrollment End Date',
      cell: (element: any) => `${element.enrollmentEndDate}`,
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
      // cell: (element: any) => `${element.action}`,
      styles: { 'font-size.px': 12, color: '#333' },
    }
  ];
  filterFields = [];
  keywords: any = [];
  resetKey: any;

  constructor(
    private _fb: FormBuilder,
    private _shared: SharedService,
    private _course: CourseService,
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
    this.courseForm = this._fb.group({
      createdFor: [''],
      courseId: '',
      status: ''
    }, { validator: atLeastOneValidator() });
    this._loader.emitLoaderStatus(false);
  }

  getSearchForm() {
    this._course.getCourseFilter().subscribe((resp: any) => {
      if(resp.statusCode == 200 && resp.response.length > 0){
        this.filterFields = resp.response;
      }
    })
  }

  onChangeHandler = (val: any) => {
    if (val.dataType == 'array' && val.value.length > 0) {
      this.payload[`${val.property}`] = [val.value.toString().trim()];
      this.courseForm.patchValue({
        [val.property]: [val.value.toString().trim()],
      });
    } else if (
      typeof val.value == 'object' &&
      val.dataType == 'string' &&
      val.value != null
    ) {
      this.payload[`${val.property}`] = val.value;
      this.courseForm.patchValue({ [val.property]: val.value });
    } else if (
      val.dataType == 'string' &&
      val.value != '' &&
      val.value != null
    ) {
      this.payload[`${val.property}`] = val.value.trim();
      this.courseForm.patchValue({ [val.property]: val.value.trim() });
    } else {
      delete this.payload[`${val.property}`];
      this.courseForm.patchValue({ [val.property]: '' });
    }
  };

  searchCourse() {
    this._loader.emitLoaderStatus(true);
    if(this.payload['createdFor']) {
      this.payload['createdFor'] = this.payload['createdFor'].toString()
    }
    if(this.payload['courseId']) {
      this.payload['courseId'] = this.payload['courseId'].toString().replace(/\s/g, "").split(',')
    }
    if(this.payload.status && typeof this.payload.status !== 'number') {
      let statusArr = ['Pending', 'In Progress', 'Completed'];
      this.payload.status = statusArr.indexOf(this.payload.status.toString());
    }
    let request = {
      request: {
        filters: this.payload,
        limit: 10000,
        fields: [],
        sort_by: {
          createdDate: "desc"
        },
      }
    };
    this._course.getCourseList(request).subscribe((result: any) => {
      if (result.statusCode == 200 && result.response.length > 0) {
        this.tableData = [];
        result.response.map((element: any) => {
          this.tableData.push({
            courseId: element.courseId,
            courseName: element.courseName,
            batchId: element.batchId,
            createdOn: element.createdOn !== '---' ? this.datepipe.transform(
              element.createdOn,
              "dd/MM/yyyy h:mm a"
            ) : '',
            createdFor: element.createdFor,
            channel: element.channel,
            createdBy: element.createdBy,
            startDate: element.startDate,
            endDate: element.endDate,
            enrollmentType: element.enrollmentType,
            enrollmentEndDate: element.enrollmentEndDate,
            status: element.status,
            mentors: element.mentors
            });
        });
        this._loader.emitLoaderStatus(false);
      } else {
        this._loader.emitLoaderStatus(false);
        this.tableData = [];
        this._message.invoke('No records found.');
      }
    });
  }

  resetForm() {
    this.payload = {};
    this.courseForm.reset();
    this._shared.emitResetStatus({ status: true, type: 'all' });
    this.tableData = [];
  }

  clearFields(key: any) {
    this.resetKey = { [key.key]: key.value };
    delete this.payload[`${key.key}`];
    this.courseForm.patchValue({ [key.key]: '' });
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
