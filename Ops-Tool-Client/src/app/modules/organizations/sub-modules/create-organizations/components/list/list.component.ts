import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { OrganizationsService } from 'src/app/helpers/services/organizations/organizations.service';
import { SharedService } from 'src/app/helpers/services/shared/shared.service';
import { LoaderService } from 'src/app/helpers/utils/loader.service';
import { MessageService } from 'src/app/helpers/services/core/message.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  createOrgForm!: FormGroup;
  channel: any;
  orgName: any;
  description: any;
  payload: any = {};
  filterFields = [];
  keywords: any = [];
  resetKey: any;

  constructor(
    private _fb: FormBuilder,
    private _shared: SharedService,
    private _org: OrganizationsService,
    private _loader: LoaderService,
    public _message: MessageService,
    private _router: Router
    ) {
    this._shared.emitResetStatus(true);
  }

  ngOnInit(): void {
    this._loader.emitLoaderStatus(true);
    this.getSearchForm();
    this.payload = {};
    this.createOrgForm = this._fb.group({
      orgName: ['', Validators.required],
      channel: ['', Validators.required],
      description: '',
      organisationType: '',
      isTenant: '',
      externalId: '',
      id: '',
      type: ''

    });
    this._loader.emitLoaderStatus(false);
  }

  getSearchForm() {
    this._org.getOrganizationsCreateFilter().subscribe((resp: any) => {
      if(resp.statusCode == 200 && resp.response.length > 0){
        this.filterFields = resp.response;
      }
    })
  }

  onChangeHandler = (val: any) => {
    if (val.dataType == 'array' && val.value.length > 0) {
      this.payload[`${val.property}`] = [val.value.toString().trim()];
      this.createOrgForm.patchValue({ [val.property]: [val.value.toString().trim()] });
    } else if (typeof val.value == 'object' && val.dataType == 'string' && val.value != null) {
      this.payload[`${val.property}`] = val.value;
      this.createOrgForm.patchValue({ [val.property]: val.value });
    } else if (val.dataType == 'string' && val.value != '' && val.value != null) {
      this.payload[`${val.property}`] = val.value.trim();
      this.createOrgForm.patchValue({ [val.property]: val.value.trim() });
    } else if (val.dataType == 'boolean' && val.value != '' && val.value != null) {
      this.payload[`${val.property}`] = val.value.toLowerCase().trim() === 'true';
      this.createOrgForm.patchValue({ [val.property]: val.value.trim() });
    } else {
      delete this.payload[`${val.property}`];
      this.createOrgForm.patchValue({ [val.property]: "" });
    }
  }

  channelSearch() {
    this._loader.emitLoaderStatus(true);
    let request = {
      "request":{
        "filters": {
          "channel":this.payload.channel
        },
        "limit":10,
        "fields":[]
      }
    }
    this._org.getOrganizationsList(request)
      .subscribe((result: any) => {
        if (result.statusCode == 200 && result.response.count > 0) {
          this._message.invoke('Channel already exists.');
          this._loader.emitLoaderStatus(false);
        } else {
          this.createOrg()
        }
      })
  }

  createOrg() {
    let request = {
      "request": {
        "orgName": this.payload.orgName,
        "description": this.payload.description,
        "channel": this.payload.channel,
        "provider": this.payload.channel,
        "organisationType": "board",
        "isTenant": true,
        "externalId": ""
      }
    };
    this._org.createOrganizations(request)
      .subscribe((result: any) => {
        if (result.statusCode == 200 && result.response.response === 'SUCCESS' && result.response.organisationId) {
          this._message.invoke('Org created successfully. Fetching org data . . .');
          this._shared.sharedData = result.response.organisationId;
          setTimeout(() => {
            this._router.navigateByUrl('/organizations/list');
          }, 3000);
        } else {
          this._loader.emitLoaderStatus(false);
          this._message.invoke('Error creating organization.');
        }
      }, (error: any) => {
          this._loader.emitLoaderStatus(false);
          this._message.invoke('Something went wrong. Please, try again.');
      })
  }

  resetForm() {
    this.payload = {};
    this.createOrgForm.reset();
    this._shared.emitResetStatus({ status: true, type: 'all' });
  }


  clearFields(key: any) {
    this.resetKey = { [key.key]: key.value };
    delete this.payload[`${key.key}`];
    this.createOrgForm.patchValue({ [key.key]: "" });
    this._shared.emitResetStatus({ status: true, type: key.key, value: key.value });
  }

  getKeyValueTypes(key: any) {
    if (typeof key.value == 'object') {

    }
    return key.value;
  }
}
