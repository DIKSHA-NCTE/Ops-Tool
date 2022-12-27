import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { SharedService } from 'src/app/helpers/services/shared/shared.service';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-input-field',
  templateUrl: './input-field.component.html',
  styleUrls: ['./input-field.component.scss']
})
export class InputFieldComponent implements OnInit {

  @Input() label: any;
  @Input() placeholder: any;
  @Input() type: any;
  @Input() validators: any;
  @Input() invalidError: any;
  @Input() property: any;
  @Input() dataType: any;
  @Input() editable: boolean = false;
  @Input() required: boolean = false;
  @Input() visible: boolean = true;
  @Input() appearance: any;


  matcher = new MyErrorStateMatcher();

  @Output() getSelectedValue = new EventEmitter<any>();
  selected: any;
  inputFormControl: any;
  showPassword: boolean  = false;
  constructor(private _shared: SharedService) {
    this._shared.loaderStatusEmitted$.subscribe((result: any) => {
      if (result.status === true && result.type === 'all') {
        this.selected = null;
        this.inputFormControl.reset();
      } else
        if (result.status === true && result.type === 'input') {
          this.selected = null;
          this.inputFormControl.reset();
      } else {
        if (result.status === true && result.value.trim() == this.inputFormControl.value.trim()) {
          this.selected = null;
          this.inputFormControl.reset();
        }
      }
    });

    this._shared.loadUpdateStatus$.subscribe((result: any) => {
      if (this.property == result.type) {
        this.inputFormControl.setValue(result.value.trim())
      }
    });
  }

  ngOnInit(): void {
    this.inputFormControl = new FormControl('', this.validators);
    if(!this.editable) {
      this.inputFormControl.disable()
    }
  }

  getSelectedData(selected: any) {
    this.selected = this.inputFormControl.value.trim();
    this.getSelectedValue.next({ property: this.property, dataType: this.dataType, value: this.selected });
  }

  public togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

}