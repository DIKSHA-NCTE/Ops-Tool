import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { FormsService } from 'src/app/helpers/services/forms/forms.service';
import { SharedService } from 'src/app/helpers/services/shared/shared.service';
import { LoaderService } from 'src/app/helpers/utils/loader.service';
import { MessageService } from 'src/app/helpers/services/core/message.service';
import { atLeastOneValidator } from 'src/app/helpers/directives/custom-validator.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  formsListForm!: FormGroup;
  tableData: any = [];
  payload: any = {};
  columnsToBeDisplayed = [
    { columnDef: 'type', header: 'Type', cell: (element: any) => `${element.type}`, styles: { 'font-size.px': 12.5, 'color': '#172c28' } },
    { columnDef: 'subType', header: 'Sub Type', cell: (element: any) => `${element.subType}`, styles: { 'font-size.px': 12, 'color': '#333' } },
    { columnDef: 'rootOrgId', header: 'Root Org', cell: (element: any) => `${element.rootOrgId}`, styles: { 'font-size.px': 12, 'color': '#333' } },
    { columnDef: 'framework', header: 'Framework', cell: (element: any) => `${element.framework}`, styles: { 'font-size.px': 12, 'color': '#333' } },
    { columnDef: 'view_form', header: 'Action', styles: { 'font-size.px': 12, color: '#333' } }
  ];
  filterFields = [];
  keywords: any = [];
  resetKey: any;

  constructor(
    private _fb: FormBuilder,
    private _shared: SharedService,
    private _forms: FormsService,
    private _loader: LoaderService,
    public _message: MessageService) {
    this._shared.emitResetStatus(true);
  }

  ngOnInit(): void {
    this._loader.emitLoaderStatus(true);
    this.getSearchForm();
    this.payload = {};
    this.formsListForm = this._fb.group({
      rootOrgId: [''],
      framework: [''],
    }, { validator: atLeastOneValidator() });
    this._loader.emitLoaderStatus(false);
  }

  getSearchForm() {
    this._forms.getFormsFilter().subscribe((resp: any) => {
      if(resp.statusCode == 200 && resp.response.length > 0){
        this.filterFields = resp.response;
      }
    })
  }

  onChangeHandler = (val: any) => {
    if (val.dataType == 'array' && val.value.length > 0) {
      this.payload[`${val.property}`] = [val.value.toString().trim()];
      this.formsListForm.patchValue({ [val.property]: [val.value.toString().trim()] });
    } else if (typeof val.value == 'object' && val.dataType == 'string' && val.value != null) {
      this.payload[`${val.property}`] = val.value;
      this.formsListForm.patchValue({ [val.property]: val.value });
    } else if (val.dataType == 'string' && val.value != '' && val.value != null) {
      this.payload[`${val.property}`] = val.value.trim();
      this.formsListForm.patchValue({ [val.property]: val.value.trim() });
    } else {
      delete this.payload[`${val.property}`];
      this.formsListForm.patchValue({ [val.property]: "" });
    }
  }

  searchForms() {
    this._loader.emitLoaderStatus(true);
    let request = {
      "request": this.payload
    };
    this._forms.listForm(request)
      .subscribe((result: any) => {
        if (result.statusCode == 200 && result.response.result.count > 0) {
          this.tableData = [];
          result.response.result.forms.map((element: any) => {
            this.tableData.push({
              type: element.type,
              subType: element.subtype,
              action: element.action,
              rootOrgId: element.root_org,
              framework: element.framework,
              component: element.component,
              templateName: JSON.parse(element.data).templateName
            });
          });
          this._loader.emitLoaderStatus(false);
        } else {
          this.tableData = [];
          this._loader.emitLoaderStatus(false);
          this._message.invoke('No records found.');
        }
      }, (error: any) => {
          this.tableData = [];
          this._loader.emitLoaderStatus(false);
          this._message.invoke('Something went wrong. Please, try again.');
      })
  }

  resetForm() {
    this.payload = {};
    this.formsListForm.reset();
    this._shared.emitResetStatus({ status: true, type: 'all' });
    this.tableData = [];
  }

  clearFields(key: any) {
    this.resetKey = { [key.key]: key.value };
    delete this.payload[`${key.key}`];
    this.formsListForm.patchValue({ [key.key]: "" });
    this._shared.emitResetStatus({ status: true, type: key.key, value: key.value });
  }

  getKeyValueTypes(key: any) {
    if (typeof key.value == 'object') {

    }
    return key.value;
  }
}
