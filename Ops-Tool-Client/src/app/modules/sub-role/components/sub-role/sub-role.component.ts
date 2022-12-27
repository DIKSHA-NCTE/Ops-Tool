import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormsService } from 'src/app/helpers/services/forms/forms.service';
import { SubRoleService } from 'src/app/helpers/services/sub-role/sub-role.service';
import { SharedService } from 'src/app/helpers/services/shared/shared.service';
import { LoaderService } from 'src/app/helpers/utils/loader.service';
import { MessageService } from 'src/app/helpers/services/core/message.service';

@Component({
  selector: 'app-sub-role',
  templateUrl: './sub-role.component.html',
  styleUrls: ['./sub-role.component.scss'],
})
export class SubRoleComponent implements OnInit {
  subRoleUpdateForm!: FormGroup;
  state: any = [];
  role: any = [];
  value: any;
  label: any;
  subrole: any = [];
  newSubrole: any = [];
  existingSubRoles: any = [];
  selectedOptions: any = [];
  allOptions: any = [];
  payload: any = {};
  filterFields: any = [];
  keywords: any = [];
  resetKey: any;
  addbtnEnabled: boolean = false;
  formResponse : any = {};
  removed: any = [];

  constructor(
    private _fb: FormBuilder,
    private _shared: SharedService,
    private _form: FormsService,
    private _subRole: SubRoleService,
    private _loader: LoaderService,
    public _message: MessageService
  ) {
    this._shared.emitResetStatus(true);
  }

  ngOnInit(): void {
    this._loader.emitLoaderStatus(true);
    this.getSubRoleConfigForm();
    this.payload = {};
    this.subRoleUpdateForm = this._fb.group({
      state: ['', Validators.required],
      role: ['', Validators.required],
      value: '',
      label: '',
      subrole: [[], Validators.required],
      newSubrole: [],
      subRoles: []
    });
    this._loader.emitLoaderStatus(false);
  }

  getSubRoleConfigForm() {
    this._subRole.getSubRoleAddForm().subscribe((resp: any) => {
      if(resp.statusCode == 200 && resp.response.length > 0){
        this.filterFields = resp.response;
      }
    })
  }

  addSubRole() {
    if ((this.subRoleUpdateForm.value.label !== null && this.subRoleUpdateForm.value.label !== '' && 
    this.subRoleUpdateForm.value.label !== undefined) && 
    (this.subRoleUpdateForm.value.value !== null && this.subRoleUpdateForm.value.value !== '' && 
    this.subRoleUpdateForm.value.value !== undefined)) {
      this.newSubrole.push({
        label: this.subRoleUpdateForm.value.label,
        value: this.subRoleUpdateForm.value.value
      })
      this.subRoleUpdateForm.patchValue({ newSubrole: this.newSubrole });
      this._shared.emitResetStatus({
        status: true,
        type: 'input'
      });
      this.subRoleUpdateForm.patchValue({ label: '' });
      this.subRoleUpdateForm.patchValue({ value: '' });
    }
  }

  bind() {
    this.subrole = [];
    this.existingSubRoles = [];
    this.selectedOptions= [];
    if(this.payload.state && this.payload.role) {
      let role = this.payload.role.toString().toLowerCase();
      this.formResponse.data.fields[1].children[`${role}`].find((ele: any) => {
        if(ele.code == 'subPersona') {
          ele.templateOptions.options.map((obj: any) => {
            this.existingSubRoles.push({label: obj.label, value: obj.value});
            this.selectedOptions.push(obj.value);
          })
          this._shared.emitUpdateStatus({type: 'subRoles', value: this.selectedOptions});
          this.subrole.push(...this.existingSubRoles);
          this.subRoleUpdateForm.patchValue({ subrole: this.subrole });
        }
      })
    }
    // this.payload.subRoles = this.subrole;
    this.subRoleUpdateForm.patchValue({ subrole: this.subrole });
    this.filterFields.find((ele: any) => {
      if (ele.property == 'subRoles' && this.subrole.length > 0) {
        ele.editable = true;
      }
      if (ele.property == 'subRoles' && this.subrole.length == 0) {
        ele.editable = false;
        if(this.payload.state && this.payload.role) {
          this._message.invoke('Unable to update sub roles due to config issue.');
        }
      }
    })
  }

  multiOptHandler (val: any) {
    let temp: any = [];
    let temp2: any = [];
    let temp3 : any = [];
    val.value.forEach((el: any) => {
      val.options.filter((opt: any) => {
        if(opt.value === el) {
          temp.push(opt);
          temp3.push(opt.value);
        }
      })
    })
    val.options.filter((opt: any) => {
      if(!(temp.includes(opt))) {
        temp2.push(opt);
      }
    })
    this.subrole = temp;
    this.removed = temp2;
    this.selectedOptions = temp3;
    this.subRoleUpdateForm.patchValue({
      'subrole': temp,
    });
  }

  onChangeHandler = (val: any) => {
    if (val.dataType == 'array' && val.value.length > 0 && val.property !== 'subRoles') {
      this.payload[`${val.property}`] = [val.value.toString().trim()];
      this.subRoleUpdateForm.patchValue({
        [val.property]: [val.value.toString().trim()],
      });
      if(val.property == 'state' && val.value.length > 0) {
        this._loader.emitLoaderStatus(true);
        this.formResponse = {};
        let req = {
          "request": {
            "action": "get",
            "subType": val.value.toString(),
            "type": "profileConfig_v2"
        }
        }
        this._form.readForm(req).subscribe((result: any) => {
          if(result.statusCode == 200 && result.response.responseCode == 'OK' && result.response.result.form.data.fields.length > 0) {
            this.formResponse = result.response.result.form;
            this.formResponse.subType = result.response.result.form.subtype;
            delete this.formResponse.created_on;
            delete this.formResponse.last_modified_on;
            delete this.formResponse.subtype;
            this.newSubrole = [];
            this.removed = [];
            this.bind();
            this._loader.emitLoaderStatus(false);
          } else {
            this.bind();
            this.formResponse = {};
            this._loader.emitLoaderStatus(false);
            this._message.invoke("Error fetching subrole data. Please, try again.");
          }
        }, (error: any) => {
          this.bind();
          this.formResponse = {};
          this._loader.emitLoaderStatus(false);
          this._message.invoke("Something went wrong. Please, refresh and try again.");
        })
      }
      if (val.property == 'role' && val.value.length > 0) {
        this.newSubrole = [];
        this.removed = [];
        this.bind();
      }
    } else if (val.dataType == 'array' && val.value.length > 0 && val.multiple == true && val.property == 'subRoles') {
      this.allOptions = val.options;
      this.multiOptHandler(val);
    } else if (
      typeof val.value == 'object' &&
      val.dataType == 'string' &&
      val.value != null
    ) {
      this.payload[`${val.property}`] = val.value;
      this.subRoleUpdateForm.patchValue({ [val.property]: val.value });
    } else if (
      val.dataType == 'string' &&
      val.value != '' &&
      val.value != null
    ) {
      this.payload[`${val.property}`] = val.value.trim();
      this.subRoleUpdateForm.patchValue({ [val.property]: val.value.trim() });
    } else {
      delete this.payload[`${val.property}`];
      this.subRoleUpdateForm.patchValue({ [val.property]: '' });
    }
  };

  updateSubRole() {
    this._loader.emitLoaderStatus(true);
    let request = {};
    this.payload.finalSubRole = [...this.subrole, ...this.newSubrole];
    let formData = JSON.parse(JSON.stringify(this.formResponse));
    let role = this.payload.role.toString().toLowerCase();
    //check for existence of nested properties
    if (Object.keys(formData).length !== 0 && formData?.data?.fields[1]?.children[`${role}`] ) {
      formData.data.fields[1].children[`${role}`].find((ele: any) => {
        if(ele.code == 'subPersona') {
          ele.templateOptions.options = this.payload.finalSubRole;
          request = {
            request: formData
          }
        }
      })
    }

    if (request && Object.keys(request).length !== 0) {
      this._form.updateForm(request).subscribe((result: any) => {
        if (result.statusCode == 200 && result.response.responseCode == 'OK' && result.response.result.response[0].status == 'SUCCESS') {
          this.resetForm();
          this._loader.emitLoaderStatus(false);
          this._message.invoke('Sub roles updated successfully.');
        } else {
          this._loader.emitLoaderStatus(false);
          this._message.invoke('Error updating sub roles.');
        }
      }, (error: any) => {
        this._loader.emitLoaderStatus(false);
        this._message.invoke('Something went wrong. Please, try again.');
      })
  } else {
    this._loader.emitLoaderStatus(false);
    this._message.invoke('Not able to update sub roles due to config issue.');
  }
}

  resetForm() {
    this.payload = {};
    this.newSubrole = [];
    this.subRoleUpdateForm.reset();
    this.filterFields.find((ele: any) => {
      if (ele.property == 'subRoles') {
        ele.editable = false;
      }
    })
    this._shared.emitResetStatus({ status: true, type: 'all' });
    this.removed = [];
  }

  clearFieldsAdd(index: any) {
    this.newSubrole.splice(index, 1)
    this.subRoleUpdateForm.patchValue({ newSubrole: this.newSubrole });
  }
  // clearFieldsRemove(item: any) {
  //   let val = {
  //     options: this.allOptions,
  //     value: this.selectedOptions
  //   }
  //   this.selectedOptions.push(item.value);
  //   this._shared.emitUpdateStatus({type: 'subRoles', value: this.selectedOptions});
  //   this.multiOptHandler(val);
  // }

  getKeyValueTypes(key: any) {
    if (typeof key.value == 'object') {
    }
    return key.value;
  }
}