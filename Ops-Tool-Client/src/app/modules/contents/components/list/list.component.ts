import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ContentsService } from 'src/app/helpers/services/contents/contents.service';
import { SharedService } from 'src/app/helpers/services/shared/shared.service';
import { DatePipe } from "@angular/common";
import { LoaderService } from 'src/app/helpers/utils/loader.service';
import { MessageService } from 'src/app/helpers/services/core/message.service';
import { atLeastOneValidator } from 'src/app/helpers/directives/custom-validator.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  contentsForm!: FormGroup;
  tableData: any = [];
  payload: any = {};
  columnsToBeDisplayed = [
    { columnDef: 'identifier', header: 'Identifier', cell: (element: any) => `${element.identifier}`, styles: { 'font-size.px': 12.5, 'color': '#172c28' } },
    { columnDef: 'name', header: 'Name', cell: (element: any) => `${element.name}`, styles: { 'font-size.px': 12, 'color': '#333' } },
    { columnDef: 'board', header: 'Board', cell: (element: any) => `${element.board}`, styles: { 'font-size.px': 12, 'color': '#333' } },
    { columnDef: 'medium', header: 'Medium', cell: (element: any) => `${element.medium}`, styles: { 'font-size.px': 12, 'color': '#333' } },
    { columnDef: 'gradeLevel', header: 'Grade', cell: (element: any) => `${element.gradeLevel}`, styles: { 'font-size.px': 12, 'color': '#333' } },
    { columnDef: 'subject', header: 'Subject', cell: (element: any) => `${element.subject}`, styles: { 'font-size.px': 12, 'color': '#333' } },
    { columnDef: 'status', header: 'Status', cell: (element: any) => `${element.status}`, styles: { 'font-size.px': 12, 'color': '#333' } }
  ];
  filterFields = [];
  keywords: any = [];
  resetKey: any;

  constructor(
    private _fb: FormBuilder,
    private _shared: SharedService,
    private _contents: ContentsService,
    private _loader: LoaderService,
    public _message: MessageService,
    private datepipe: DatePipe) {
    this._shared.emitResetStatus(true);
  }

  ngOnInit(): void {
    this._loader.emitLoaderStatus(true);
    this.getSearchForm();
    this.payload = {};
    this.contentsForm = this._fb.group({
      channel: [''],
      name: '',
      status: '',
      identifier: '',
      origin: '',
      board: '',
      medium: '',
      gradeLevel: '',
      subject: '',
      lastPublishedOn: '',
      createdOn: '',
      contentType: '',
      createdFor: '',
      createdBy: '',
      mimeType: '',
      primaryCategory: '',
      additionalCategories:''
    }, { validator: atLeastOneValidator() });
    this._loader.emitLoaderStatus(false);
  }

  getSearchForm() {
    this._contents.getContentsFilter().subscribe((resp: any) => {
      if(resp.statusCode == 200 && resp.response.length > 0){
        this.filterFields = resp.response;
      }
    })
  }

  onChangeHandler = (val: any) => {
    if (val.dataType == 'array' && val.value.length > 0) {
      this.payload[`${val.property}`] = [val.value.toString().trim()];
      this.contentsForm.patchValue({ [val.property]: [val.value.toString().trim()] });
    } else if (typeof val.value == 'object' && val.dataType == 'string' && val.value != null) {
      this.payload[`${val.property}`] = val.value;
      this.contentsForm.patchValue({ [val.property]: val.value });
    } else if (val.dataType == 'string' && val.value != '' && val.value != null) {
      this.payload[`${val.property}`] = val.value.trim();
      this.contentsForm.patchValue({ [val.property]: val.value.trim() });
    } else {
      delete this.payload[`${val.property}`];
      this.contentsForm.patchValue({ [val.property]: "" });
    }
  }

  searchContents() {
    this._loader.emitLoaderStatus(true);
    if(!this.payload.status) {
      this.payload.status = [];
    }
    if(this.payload.identifier && typeof this.payload.identifier == 'string') {
      this.payload.identifier = this.payload.identifier.replace(/\s/g, "").split(',');
    }
    let request = {
      "request": {
        "filters": this.payload,
        "limit": 10000,
        "sort_by": { "createdOn": "desc" },
        "fields": []
      }
    };
    this._contents.getContentsList(request)
      .subscribe((result: any) => {
        if (result.statusCode == 200 && result.response.count > 0) {
          this.tableData = [];
          result.response.content.map((element: any) => {
            this.tableData.push({
              name: element.name,
              description: element.description,
              board: element.board,
              gradeLevel: element["gradeLevel"] ? element["gradeLevel"].toString() : "",
              subject: element.subject,
              medium: element.medium,
              mimeType: element.mimeType,
              contentType: element.contentType,
              primaryCategory: element.primaryCategory,
              additionalCategories: element.additionalCategories ? element.additionalCategories.toString() : "",
              identifier: element.identifier,
              status: element.status,
              artifactUrl: element.artifactUrl,
              downloadUrl: element.downloadUrl,
              createdBy: element.createdBy,
              createdOn: this.datepipe.transform(
                element.createdOn,
                "dd/MM/yyyy h:mm a"
              ),
              createdFor: element["createdFor"] ? element["createdFor"].toString() : "",
              lastUpdatedOn: this.datepipe.transform(
                element.lastUpdatedOn,
                "dd/MM/yyyy h:mm a"
              ),
              framework: element.framework,
              attributions: element["attributions"]
                ? element["attributions"].toString()
                : "",
              lastUpdatedBy: element.lastUpdatedBy,
              creator: element.creator,
              ownershipType: element["ownershipType"]
                ? element["ownershipType"].toString()
                : "",
              organisation: element["organisation"]
                ? element["organisation"].toString()
                : "",
              channel: element["channel"] ? element["channel"] : "",
              origin: element['origin'] ? element['origin'] : '',
              originData: (element['originData'] !== null && element['originData'] !== undefined) ? element['originData'].toString() : '',
              pkgVersion: element["pkgVersion"] ? element["pkgVersion"] : ""
            });
          });
          this._loader.emitLoaderStatus(false);
        } else {
          this.tableData = [];
          this._message.invoke('No records found.');
          this._loader.emitLoaderStatus(false);
        }
      })
  }

  resetForm() {
    this.payload = {};
    this.contentsForm.reset();
    this._shared.emitResetStatus({ status: true, type: 'all' });
    this.tableData = [];
  }

  clearFields(key: any) {
    this.resetKey = { [key.key]: key.value };
    delete this.payload[`${key.key}`];
    this.contentsForm.patchValue({ [key.key]: "" });
    this._shared.emitResetStatus({ status: true, type: key.key, value: key.value });
  }

  getKeyValueTypes(key: any) {
    if (typeof key.value == 'object') {

    }
    return key.value;
  }
}
