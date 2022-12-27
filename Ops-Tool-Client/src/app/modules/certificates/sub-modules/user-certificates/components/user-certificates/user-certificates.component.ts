import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CertificatesService } from 'src/app/helpers/services/certificates/certificates.service';
import { SharedService } from 'src/app/helpers/services/shared/shared.service';
import { DatePipe } from '@angular/common';
import { LoaderService } from 'src/app/helpers/utils/loader.service';
import { MessageService } from 'src/app/helpers/services/core/message.service';
import { atLeastOneValidator } from 'src/app/helpers/directives/custom-validator.service';

@Component({
  selector: 'app-user-certificates',
  templateUrl: './user-certificates.component.html',
  styleUrls: ['./user-certificates.component.scss'],
})
export class UserCertificatesComponent implements OnInit {
  certificateForm!: FormGroup;
  userName: any = [];
  email: any = [];
  phone: any = [];
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
      columnDef: 'batchId',
      header: 'Batch ID',
      cell: (element: any) => `${element.batchId}`,
      styles: { 'font-size.px': 12, color: '#333' },
    },
    {
      columnDef: 'courseName',
      header: 'Course Name',
      cell: (element: any) => `${element.courseName}`,
      styles: { 'font-size.px': 12, color: '#333' },
    },
    {
      columnDef: 'completionPercentage',
      header: 'Completion Percentage',
      cell: (element: any) => `${element.completionPercentage}`,
      styles: { 'font-size.px': 12, color: '#333' },
    },
    {
      columnDef: 'completedOn',
      header: 'Completed On',
      cell: (element: any) => `${element.completedOn}`,
      styles: { 'font-size.px': 12, color: '#333' },
    },
    {
      columnDef: 'certificateUrl',
      header: 'Certificate Identifier/URL',
      cell: (element: any) => `${element.certificateUrl}`,
      styles: { 'font-size.px': 12, color: '#333' },
    },{
      columnDef: 'certificateType',
      header: 'Certificate Type',
      cell: (element: any) => `${element.certificateType}`,
      styles: { 'font-size.px': 12, color: '#333' },
    },
    {
      columnDef: 'cert_download',
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
    private _certificate: CertificatesService,
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
    this.certificateForm = this._fb.group({
      userName: '',
      email: '',
      phone: ''
    }, { validator: atLeastOneValidator() });
    this._loader.emitLoaderStatus(false);
  }

  getSearchForm() {
    this._certificate.getUserCertificatesFilter().subscribe((resp: any) => {
      if(resp.statusCode == 200 && resp.response.length > 0){
        this.filterFields = resp.response;
      }
    })
  }

  onChangeHandler = (val: any) => {
    if (val.dataType == 'array' && val.value.length > 0) {
      this.payload[`${val.property}`] = [val.value.toString().trim()];
      this.certificateForm.patchValue({
        [val.property]: [val.value.toString().trim()],
      });
    } else if (
      typeof val.value == 'object' &&
      val.dataType == 'string' &&
      val.value != null
    ) {
      this.payload[`${val.property}`] = val.value;
      this.certificateForm.patchValue({ [val.property]: val.value });
    } else if (
      val.dataType == 'string' &&
      val.value != '' &&
      val.value != null
    ) {
      this.payload[`${val.property}`] = val.value.trim();
      this.certificateForm.patchValue({ [val.property]: val.value.trim() });
    } else {
      delete this.payload[`${val.property}`];
      this.certificateForm.patchValue({ [val.property]: '' });
    }
  };

  searchCerts() {
    this._loader.emitLoaderStatus(true);
    let request = {
      request: {
        filters: this.payload,
        limit: 10000,
        fields: [],
        sort_by: {
        createdDate: "desc"
      }
    }
  };
    this._certificate.getUserListing(request).subscribe((result: any) => {
      if(result.statusCode == 200 && result.response.result.response.count > 0) {
        let response = result.response.result.response.content[0];
        let userId = response.userId;
        let userName = response.userName;
        let request = {
          metaInfo: JSON.stringify({ userId, userName })
        };
        this._certificate.getEnrollmentList(request).subscribe((result: any) => {
          if (result.statusCode == 200 && result.response.result.courses.length > 0) {
            this.tableData = [];
            result.response.result.courses.map((element: any) => {
              if(element.certificates.length == 0 && element.issuedCertificates == 0) {
                this.tableData.push({
                  courseId: element.courseId,
                  batchId: element.batchId,
                  courseName: element.courseName,
                  completionPercentage: element.completionPercentage,
                  completedOn: this.datepipe.transform(
                    element.completedOn,
                    "dd/MM/yyyy h:mm a"
                  ),
                  certificateUrl: '',
                  certificateToken: '',
              });
              }

              if (element.certificates && element.certificates.length > 0 ) {
                element.certificates.map((ele: any) => {
                  this.tableData.push({
                    courseId: element.courseId,
                    batchId: element.batchId,
                    courseName: element.courseName,
                    completionPercentage: element.completionPercentage,
                    completedOn: this.datepipe.transform(
                      element.completedOn,
                      "dd/MM/yyyy h:mm a"
                    ),
                    certificateUrl: ele.url,
                    certificateToken: ele.token,
                    certificateType: 'PDF',
                });
              });
              } 

            if (element.issuedCertificates && element.issuedCertificates.length > 0 ) {
              element.issuedCertificates.map((ele: any) => {
                this.tableData.push({
                  courseId: element.courseId,
                  batchId: element.batchId,
                  courseName: element.courseName,
                  completionPercentage: element.completionPercentage,
                  completedOn: this.datepipe.transform(
                    element.completedOn,
                    "dd/MM/yyyy h:mm a"
                  ),
                  certificateUrl: ele.identifier,
                  certificateToken: ele.token,
                  certificateType: 'SVG'
              });
            });
            }
            this._loader.emitLoaderStatus(false);
          });
          } else {
            this.tableData = [];
            this._loader.emitLoaderStatus(false);
            this._message.invoke('No records found.');
          }
        },
        (error: any) => {
          this.tableData = [];
          this._loader.emitLoaderStatus(false);
          this._message.invoke('Something went wrong. Please, try again.');
        })
      } else {
        this.tableData = [];
        this._loader.emitLoaderStatus(false);
        this._message.invoke('No user records found.');
      }
    }, 
    (error: any) => {
      this.tableData = [];
      this._loader.emitLoaderStatus(false);
      this._message.invoke('Something went wrong. Please, try again.');
    })
  
  }

  resetForm() {
    this.payload = {};
    this.certificateForm.reset();
    this._shared.emitResetStatus({ status: true, type: 'all' });
    this.tableData = [];
  }

  clearFields(key: any) {
    this.resetKey = { [key.key]: key.value };
    delete this.payload[`${key.key}`];
    this.certificateForm.patchValue({ [key.key]: '' });
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
