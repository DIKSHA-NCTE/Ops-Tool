import { Component, OnInit } from '@angular/core';
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
  updateOrgForm!: FormGroup;
  organisationId: any;
  isTenant: any;
  orgName: any;
  description: any;
  externalId: any;
  organisationType: any;
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
    this.updateOrgForm = this._fb.group({
      organisationId: ['', Validators.required],
      orgName: '',
      description: '',
      organisationType: '',
      isTenant: '',
      externalId: ''
    });
    this._loader.emitLoaderStatus(false);
  }

  getSearchForm() {
    this._org.getOrganizationsUpdateFilter().subscribe((resp: any) => {
      if(resp.statusCode == 200 && resp.response.length > 0){
        this.filterFields = resp.response;
      }
    })
  }

  onChangeHandler = (val: any) => {
    if (val.dataType == 'array' && val.value.length > 0) {
      this.payload[`${val.property}`] = [val.value.toString().trim()];
      this.updateOrgForm.patchValue({ [val.property]: [val.value.toString().trim()] });
      if(val.property == 'organisationId' && val.value.length > 0) {
        let req = {
          "request": {
            [val.property]: [val.value].toString()
          }
        }
        this._org.readOrganization(req).subscribe((result: any) => {
          if(result.statusCode == 200 && result.response) {
            let response = result.response.response;
            this._shared.emitUpdateStatus({type: 'orgName', value: response.orgName !== null ? response.orgName : ''});
            this._shared.emitUpdateStatus({type: 'description', value: response.description !== null ? response.description : ''});
            this._shared.emitUpdateStatus({type: 'organisationType', value: (response.organisationType !== null ? (response.organisationType  == '2' ? "School" : "Board") : '')});
            this._shared.emitUpdateStatus({type: 'isTenant', value: (response.isTenant !== null ? (response.isTenant.toString()[0].toUpperCase() + response.isTenant.toString().slice(1)): '')});
            this._shared.emitUpdateStatus({type: 'externalId', value: response.externalId !== null ? response.externalId : ''});
          } else {
            this._message.invoke("Error fetching Organization. Please, try again.");
          }
        }, (error: any) => {
          this._message.invoke("Something went wrong. Please, refresh and try again.");
        })
      }
    } else if (typeof val.value == 'object' && val.dataType == 'string' && val.value != null) {
      this.payload[`${val.property}`] = val.value;
      this.updateOrgForm.patchValue({ [val.property]: val.value });
    } else if (val.dataType == 'string' && val.value != null) {
      this.payload[`${val.property}`] = val.value.trim();
      this.updateOrgForm.patchValue({ [val.property]: val.value.trim() });
    } else if (val.dataType == 'boolean' && val.value != '' && val.value != null) {
      this.payload[`${val.property}`] = val.value.toLowerCase().trim() === 'true';
      this.updateOrgForm.patchValue({ [val.property]: val.value.trim() });
    } else {
      delete this.payload[`${val.property}`];
      this.updateOrgForm.patchValue({ [val.property]: "" });
    }
  }

  updateOrg() {
    this._loader.emitLoaderStatus(true);
    if(this.payload.orgName == '') {
      this._loader.emitLoaderStatus(false);
      this._message.invoke("Org name can't be empty.");
    } else {
      this.payload.organisationId = this.payload.organisationId.toString();
      if(this.payload.organisationType) {
        this.payload.organisationType = this.payload.organisationType.toString().toLowerCase();
      }
      let request = {
        "request": this.payload
      };
      this._org.updateOrganizations(request)
        .subscribe((result: any) => {
          if (result.statusCode == 200 && result.response.response === 'SUCCESS' && result.response.organisationId) {
            this._message.invoke('Org updated successfully. Fetching org data . . .');
            this._shared.sharedData = result.response.organisationId;
            setTimeout(() => {
              this._router.navigateByUrl('/organizations/list');
            }, 3000);
          } else {
            this._loader.emitLoaderStatus(false);
            this._message.invoke('Error updating organization.');
          }
        }, (error: any) => {
            this._loader.emitLoaderStatus(false);
            this._message.invoke('Something went wrong. Please, try again.');
        })
    }
  }

  resetForm() {
    this.payload = {};
    this.updateOrgForm.reset();
    this._shared.emitResetStatus({ status: true, type: 'all' });
  }


  clearFields(key: any) {
    this.resetKey = { [key.key]: key.value };
    delete this.payload[`${key.key}`];
    this.updateOrgForm.patchValue({ [key.key]: "" });
    this._shared.emitResetStatus({ status: true, type: key.key, value: key.value });
  }

  getKeyValueTypes(key: any) {
    if (typeof key.value == 'object') {

    }
    return key.value;
  }
}
