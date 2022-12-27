import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UsersService } from 'src/app/helpers/services/users/users.service';
import { SharedService } from 'src/app/helpers/services/shared/shared.service';
import { LoaderService } from 'src/app/helpers/utils/loader.service';
import { MessageService } from 'src/app/helpers/services/core/message.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  tenantsList: any = [];
  createUserForm!: FormGroup;
  firstName: any;
  lastName: any;
  email: any;
  phone: any;
  userName: any;
  password: any;
  roles: any
  payload: any = {};
  filterFields = [];
  keywords: any;
  resetKey: any;

  constructor(
    private _fb: FormBuilder,
    private _shared: SharedService,
    private _users: UsersService,
    private _loader: LoaderService,
    public _message: MessageService,
    private _router: Router
  ) {
    this._shared.emitResetStatus(true);
  }

  ngOnInit(): void {
    this._loader.emitLoaderStatus(true);
    this.getCreateUserForm();
    this.payload = {};
    this.createUserForm = this._fb.group({
      organisationId: [[], Validators.required],
      firstName: ['', Validators.required],
      lastName: '',
      email: '',
      phone: '',
      userName: '',
      password: '',
      roles: []
    });
    this._loader.emitLoaderStatus(false);
  }

  getCreateUserForm() {
    this._users.getCreateUsersFilter().subscribe((resp: any) => {
      if(resp.statusCode == 200 && resp.response.length > 0){
        this.filterFields = resp.response;
      }
    })
  }

  onChangeHandler = (val: any) => {
    if (val.dataType == 'array' && val.value.length > 0) {
      this.payload[`${val.property}`] = val.value;
      this.createUserForm.patchValue({
        [val.property]: val.value,
      });
    } else if (
      typeof val.value == 'object' &&
      val.dataType == 'string' &&
      val.value != null
    ) {
      this.payload[`${val.property}`] = val.value;
      this.createUserForm.patchValue({ [val.property]: val.value });
    } else if (
      val.dataType == 'string' &&
      val.value != '' &&
      val.value != null
    ) {
      this.payload[`${val.property}`] = val.value.trim();
      this.createUserForm.patchValue({ [val.property]: val.value.trim() });
    } else {
      delete this.payload[`${val.property}`];
      this.createUserForm.patchValue({ [val.property]: '' });
    }
  };

  createUser() {
    this._loader.emitLoaderStatus(true);
    if (this.payload.organisationId !== undefined) {
      this.payload.organisationId = this.payload.organisationId.toString();
    }
    let request = {
      request: this.payload
    };
    this._users.createUser(request).subscribe((result: any) => {
      if (result.statusCode == 200 && result.response.result.response == 'SUCCESS') {
        this._message.invoke('User created successfully. Fetching user data . . .');
          this._shared.sharedData = result.response.result.userId;
          setTimeout(() => {
            this._router.navigateByUrl('/users/list');
          }, 3000);
        this._loader.emitLoaderStatus(false);
      } else {
        this._loader.emitLoaderStatus(false);
        this._message.invoke(`${result.response.params.errmsg}`);
      }
    }, (error: any) => {
      this._loader.emitLoaderStatus(false);
      this._message.invoke('Something went wrong. Please, try again.');
  });
  }

  resetForm() {
    this.payload = {};
    this.createUserForm.reset();
    this._shared.emitResetStatus({ status: true, type: 'all' });
  }

  clearFields(key: any) {
    this.resetKey = { [key.key]: key.value };
    delete this.payload[`${key.key}`];
    this.createUserForm.patchValue({ [key.key]: '' });
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