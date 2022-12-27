import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/helpers/services/authentication/authentication.service';
import { LoaderService } from 'src/app/helpers/utils/loader.service';
import { ToasterService } from '../../../../helpers/utils/toaster.service';

@Component({
  selector: 'app-tokens',
  templateUrl: './tokens.component.html',
  styleUrls: ['./tokens.component.scss']
})
export class TokensComponent implements OnInit {

  public tokenForm!: FormGroup;
  public payload = { type: '0', value: '' };
  public userToken = { token: '', expires: '', refresh_token: '' };
  public displayFields: boolean = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private _auth: AuthenticationService,
    private _toaster: ToasterService, private _loader: LoaderService) { }

  ngOnInit(): void {
    this.tokenForm = this.fb.group({
      tokenFor: ['', Validators.required],
      value: ['']
    });

    let currentUser: any = localStorage.getItem("currentUser");
    if (JSON.parse(currentUser)?.length > 0) {
      let userRoles = JSON.parse(currentUser)[0].roles.split(',');
      if(userRoles.indexOf('SUPPORT ADMIN') !== -1) {
        this.displayFields = true;
      } else {
        this.displayFields = false;
          this.payload.type = '1';
          this.getSelfToken();
      }
      // switch (JSON.parse(currentUser)[0].roles) {
      //   case 'SUPPORT READ':
      //   case 'SUPPORT CRUD':
      //     this.displayFields = false;
      //     this.payload.type = '1';
      //     this.getSelfToken();
      //     break;
      //   case 'SUPPORT ADMIN':
      //     this.displayFields = true; break;
      // }
    }

    this.tokenForm.controls.tokenFor.valueChanges.subscribe(checked => {
      if (checked === '1') {
        this.payload.type = '1';
        this.getSelfToken();
        this.tokenForm.controls.value.setValidators(null);
        this.tokenForm.controls.value.reset();
      } else if (checked === '2') {
        this.payload.type = '2';
        this.tokenForm.controls.value.setValidators(Validators.required);
      }
      this.userToken = { token: '', expires: '', refresh_token: '' };
      this.tokenForm.controls.value.updateValueAndValidity();
    });
  }

  getSelfToken() {
    this._loader.emitLoaderStatus(true);
    (this.tokenForm.value! + "") ? this.payload.value = this.tokenForm.value : this.payload.value = "";
    this._auth.fetchUserAuth(this.payload).subscribe((response: any) => {
      (response.statusCode == 200) ? this.userToken = response.response : this.userToken = { token: 'Issue while fetching the token, please try again later.', expires: '', refresh_token: 'Issue while fetching the token, please try again later.' }
      this._loader.emitLoaderStatus(false);
    }, (error: any) => {
      this.userToken.token = '';
      this._loader.emitLoaderStatus(false);
      this._toaster.emitChange({ type: 'error', title: "Invalid Grant", body: error.error.error.error_description, delay: 5000 });
    });
  }

  copyText(val: string) {
    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this._toaster.emitChange({ type: 'success', title: 'Token copied to clipboard successfully!', body: '', delay: 5000 });
  }

  RefreshTokenByLogOut() {
    this._toaster.emitChange({ type: 'success', title: 'You will be logged out of the system.', body: 'Kindly re-login to get your new user token', delay: 5000 });
    setTimeout(() => {
      localStorage.removeItem('currentUser');
      window.location.replace('/logout');
      this.router.navigate(['/dashboard']);
    }, 3000);
  }
}
