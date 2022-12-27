import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder} from '@angular/forms';
import { OrganizationsService } from 'src/app/helpers/services/organizations/organizations.service';
import { SharedService } from 'src/app/helpers/services/shared/shared.service';
import { LoaderService } from 'src/app/helpers/utils/loader.service';
import { MessageService } from 'src/app/helpers/services/core/message.service';
import { DatePipe } from '@angular/common';
import { atLeastOneValidator } from 'src/app/helpers/directives/custom-validator.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  tenantsList: any = [];
  orgForm!: FormGroup;
  channel: any = [];
  isRootOrg: any = [];
  isTenant: any = [];
  orgName: any = [];
  identifier: any = [];
  externalId: any = [];
  locationIds: any = [];
  tableData: any = [];
  payload: any = {};
  columnsToBeDisplayed = [
    { columnDef: 'identifier', header: 'Identifier', cell: (element: any) => `${element.id}`, styles: { 'font-size.px': 12.5, 'color': '#172c28' } },
    { columnDef: 'orgName', header: 'Name', cell: (element: any) => `${element.orgName}`, styles: { 'font-size.px': 12, 'color': '#333' } },
    { columnDef: 'externalId', header: 'External ID', cell: (element: any) => `${element.externalId}`, styles: { 'font-size.px': 12, 'color': '#333' } },
    { columnDef: 'locationIds', header: 'Location IDs', cell: (element: any) => `${element.locationIds}`, styles: { 'font-size.px': 12, 'color': '#333' } },
    { columnDef: 'rootOrgId', header: 'Root Org ID', cell: (element: any) => `${element.rootOrgId}`, styles: { 'font-size.px': 12, 'color': '#333' } },
    { columnDef: 'isRootOrg', header: 'Is Root Org', cell: (element: any) => `${element.isRootOrg}`, styles: { 'font-size.px': 12, 'color': '#333' } },
    { columnDef: 'channel', header: 'Channel', cell: (element: any) => `${element.channel}`, styles: { 'font-size.px': 12, 'color': '#333' } },
    { columnDef: 'provider', header: 'Provider', cell: (element: any) => `${element.provider}`, styles: { 'font-size.px': 12, 'color': '#333' } },
    { columnDef: 'createdDate', header: 'Created Date', cell: (element: any) => `${element.createdDate}`, styles: { 'font-size.px': 12, 'color': '#333' } }
  ];
  filterFields = [];
  keywords: any = [];
  resetKey: any;

  constructor(
    private _fb: FormBuilder,
    private _shared: SharedService,
    private _org: OrganizationsService,
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
    this.orgForm = this._fb.group({
      channel: [''],
      isRootOrg: '',
      isTenant: '',
      orgName: '',
      identifier: '',
      externalId: '',
      locationIds: ''
    }, { validator: atLeastOneValidator() });
    if (this._shared.sharedData != undefined) {
      this.payload.identifier = this._shared.sharedData;
      this.searchOrganizations();
      this._shared.sharedData = undefined;
      this.payload = {};
    }
    this._loader.emitLoaderStatus(false);
  }

  getSearchForm() {
    this._org.getOrganizationsListFilter().subscribe((resp: any) => {
      if(resp.statusCode == 200 && resp.response.length > 0){
        this.filterFields = resp.response;
      }
    })
  }

  onChangeHandler = (val: any) => {
    if (val.dataType == 'array' && val.value.length > 0) {
      this.payload[`${val.property}`] = [val.value.toString().trim()];
      this.orgForm.patchValue({ [val.property]: [val.value.toString().trim()] });
    } else if (typeof val.value == 'object' && val.dataType == 'string' && val.value != null) {
      this.payload[`${val.property}`] = val.value;
      this.orgForm.patchValue({ [val.property]: val.value });
    } else if (val.dataType == 'string' && val.value != '' && val.value != null) {
      this.payload[`${val.property}`] = val.value.trim();
      this.orgForm.patchValue({ [val.property]: val.value.trim() });
    } else if (val.dataType == 'boolean' && val.value != '' && val.value != null) {
      this.payload[`${val.property}`] = val.value.toLowerCase().trim() === 'true';
      this.orgForm.patchValue({ [val.property]: val.value.trim() });
    } else {
      delete this.payload[`${val.property}`];
      this.orgForm.patchValue({ [val.property]: "" });
    }
  }

  searchOrganizations() {
    this._loader.emitLoaderStatus(true);
    if(this.payload['channel']) {
      this.payload['channel'] = this.payload['channel'].toString()
    }
    let request = {
      "request": {
        "filters": this.payload,
        "limit": 10000,
        "sort_by": { "createdOn": "desc" },
        "fields": []
      }
    };
    this._org.getOrganizationsList(request)
      .subscribe((result: any) => {
        if (result.statusCode == 200 && result.response.count > 0) {
          this.tableData = [];
          result.response.content.map((element: any) => {
            this.tableData.push({
              identifier: element.id,
              orgName: element.orgName,
              externalId: element.externalId,
              locationIds: element.locationIds,
              rootOrgId: element.rootOrgId,
              isRootOrg: element.isRootOrg !== null ? element.isRootOrg.toString() : '',
              channel: element.channel,
              provider: element.provider,
              createdDate: this.datepipe.transform(
                element.createdDate,
                "dd/MM/yyyy h:mm a"
              ),
              description: element.description,
              hashTagId: element.hashTagId,
              isSSOEnabled: element.isSSOEnabled !== null ? element.isSSOEnabled.toString() : '',
              isSchool: element.isSchool !== null ? element.isSchool.toString() : '',
              isTenant: element.isTenant !== null ? element.isTenant.toString() : ''
            });
          });
          this._loader.emitLoaderStatus(false);
        } else {
          this._loader.emitLoaderStatus(false);
          this.tableData = [];
          this._message.invoke('No records found.');
        }
      })
  }

  resetForm() {
    this.payload = {};
    this.orgForm.reset();
    this._shared.emitResetStatus({ status: true, type: 'all' });
    this.tableData = [];
  }


  clearFields(key: any) {
    this.resetKey = { [key.key]: key.value };
    delete this.payload[`${key.key}`];
    this.orgForm.patchValue({ [key.key]: "" });
    this._shared.emitResetStatus({ status: true, type: key.key, value: key.value });
  }

  getKeyValueTypes(key: any) {
    if (typeof key.value == 'object') {

    }
    return key.value;
  }
}