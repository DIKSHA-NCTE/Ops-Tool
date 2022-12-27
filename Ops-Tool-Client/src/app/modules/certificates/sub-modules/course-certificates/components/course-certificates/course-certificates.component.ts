import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CertificatesService } from 'src/app/helpers/services/certificates/certificates.service';
import { SharedService } from 'src/app/helpers/services/shared/shared.service';
import { DatePipe } from '@angular/common';
import { LoaderService } from 'src/app/helpers/utils/loader.service';
import { MessageService } from 'src/app/helpers/services/core/message.service';
import { atLeastOneValidator } from 'src/app/helpers/directives/custom-validator.service';

@Component({
  selector: 'app-course-certificates',
  templateUrl: './course-certificates.component.html',
  styleUrls: ['./course-certificates.component.scss'],
})
export class CourseCertificatesComponent implements OnInit {
  courseCertificateForm!: FormGroup;
  createdFor: any = [];
  courseId: any;
  batchId: any;
  status: any = [];
  tableData: any = [];
  payload: any = {};
  columnsToBeDisplayed = [
    {
      columnDef: 'name',
      header: 'Name',
      cell: (element: any) => `${element.name}`,
      styles: { 'font-size.px': 12.5, color: '#172c28' },
    },
    {
      columnDef: 'courseId',
      header: 'Course ID',
      cell: (element: any) => `${element.courseId}`,
      styles: { 'font-size.px': 12.5, color: '#333' },
    },
    {
      columnDef: 'batchId',
      header: 'Batch ID',
      cell: (element: any) => `${element.batchId}`,
      styles: { 'font-size.px': 12, color: '#333' },
    },
    {
      columnDef: 'view_cert',
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
    this.courseCertificateForm = this._fb.group({
      createdFor: [],
      courseId: '',
      batchId: '',
      status: ''
    }, { validator: atLeastOneValidator() });
    this._loader.emitLoaderStatus(false);
  }

  getSearchForm() {
    this._certificate.getCourseCertificatesFilter().subscribe((resp: any) => {
      if(resp.statusCode == 200 && resp.response.length > 0){
        this.filterFields = resp.response;
      }
    })
  }

  onChangeHandler = (val: any) => {
    if (val.dataType == 'array' && val.value.length > 0) {
      this.payload[`${val.property}`] = [val.value.toString().trim()];
      this.courseCertificateForm.patchValue({
        [val.property]: [val.value.toString().trim()],
      });
    } else if (
      typeof val.value == 'object' &&
      val.dataType == 'string' &&
      val.value != null
    ) {
      this.payload[`${val.property}`] = val.value;
      this.courseCertificateForm.patchValue({ [val.property]: val.value });
    } else if (
      val.dataType == 'string' &&
      val.value != '' &&
      val.value != null
    ) {
      this.payload[`${val.property}`] = val.value.trim();
      this.courseCertificateForm.patchValue({ [val.property]: val.value.trim() });
    } else {
      delete this.payload[`${val.property}`];
      this.courseCertificateForm.patchValue({ [val.property]: '' });
    }
  };

  searchCourseBatch() {
    this._loader.emitLoaderStatus(true);
    if(this.payload.status && typeof this.payload.status !== 'number') {
      let statusArr = ['Pending', 'In Progress', 'Completed'];
      this.payload.status = statusArr.indexOf(this.payload.status.toString());
    }
    let request = {
      request: {
        filters: this.payload,
        limit: 10000,
        sort_by: {
        createdDate: "desc"
      }
    }
  };
    this._certificate.getCourseBatch(request).subscribe((result: any) => {
      if(result.statusCode == 200 && result.response.result.response.count > 0) {
        this.tableData = []; 
        result.response.result.response.content.map((element: any) => {
          let certTemplate;
          if(element.cert_templates && Object.keys(element.cert_templates).length !== 0) {
            let key = Object.keys(element.cert_templates)[0];
            certTemplate = {
              identifier: element.cert_templates[`${key}`].identifier,
              previewUrl: element.cert_templates[`${key}`].previewUrl,
              criteria: element.cert_templates[`${key}`].criteria
            }
          }
          this.tableData.push({
            batchId: element.batchId,
            courseId: element.courseId,
            createdFor: element.createdFor ? element.createdFor.toString() : '',
            startDate: element.startDate ? this.datepipe.transform(
              element.startDate,
              "dd/MM/yyyy h:mm a"
            ) : '',
            endDate: element.endDate ? this.datepipe.transform(
              element.endDate,
              "dd/MM/yyyy h:mm a"
            ): '',
            enrollmentEndDate: element.enrollmentEndDate ? this.datepipe.transform(
              element.enrollmentEndDate,
              "dd/MM/yyyy h:mm a"
            ): '',
            enrollmentType: element.enrollmentType,
            status: element.status,
            name: element.name,
            createdBy: element.createdBy,
            description: element.description,
            collectionId: element.collectionId ? element.collectionId : '',
            mentors: element.mentors ? element.mentors.toString() : '',
            createdDate: element.createdDate ? this.datepipe.transform(
              element.createdDate,
              "dd/MM/yyyy h:mm a"
            ) : '',
            certificateTemplate: certTemplate?.previewUrl ? certTemplate.previewUrl : "does not exist",
            certificateIdentifier: certTemplate?.identifier ? certTemplate.identifier : "does not exist",
            certificateCriteria: certTemplate?.criteria ? JSON.stringify(certTemplate.criteria) : "does not exist"
          });
        });
      this._loader.emitLoaderStatus(false);
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
  
  }

  resetForm() {
    this.payload = {};
    this.courseCertificateForm.reset();
    this._shared.emitResetStatus({ status: true, type: 'all' });
    this.tableData = [];
  }

  clearFields(key: any) {
    this.resetKey = { [key.key]: key.value };
    delete this.payload[`${key.key}`];
    this.courseCertificateForm.patchValue({ [key.key]: '' });
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
