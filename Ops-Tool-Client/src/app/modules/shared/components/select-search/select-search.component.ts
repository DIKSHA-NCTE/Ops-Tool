import { Component, Input, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { SelectAutocompleteComponent } from 'mat-select-autocomplete';
import { SharedService } from 'src/app/helpers/services/shared/shared.service';

@Component({
  selector: 'app-select-search',
  templateUrl: './select-search.component.html',
  styleUrls: ['./select-search.component.scss']
})
export class SelectSearchComponent {
  @ViewChild(SelectAutocompleteComponent)
  multiSelect: SelectAutocompleteComponent = new SelectAutocompleteComponent;

  @Input() options: any;
  @Input() placeholder: any;
  @Input() isMultiple: boolean = false;
  @Input() property: any;
  @Input() label: any;
  @Input() dataType: any;
  @Input() required: boolean = false;
  @Input() visible: boolean = true;
  @Input() appearance: any;
  @Input() editable: any = true;
  selectedOptions: any = [];
  selected = this.selectedOptions;
  showError = false;
  errorMessage = '';

  @Output() getSelectedValue = new EventEmitter<any>();

  constructor(private _shared: SharedService) {
    this._shared.loaderStatusEmitted$.subscribe((result: any) => {
      if (result.status === true && result.type === 'all') {
        this.selectedOptions = [];
        this.selected = [];
      } else {
        if (result.status === true && result.value == this.selected.toString()) {
          this.selected = [];
          this.selectedOptions = [];
        }
      }
    });

    this._shared.loadUpdateStatus$.subscribe((result: any) => {
      if (this.property == result.type) {
        this.selectedOptions = (result.value)
      }
    });
  }

  onToggleDropdown() {
    this.multiSelect.toggleDropdown();
  }

  getSelectedOptions(selected: string[]) {
    this.selected = selected;
    this.getSelectedValue.next({ property: this.property, dataType: this.dataType, value: this.selected, multiple: this.isMultiple, options: this.options });
  }

  onResetSelection() {
    this.selectedOptions = [];
  }

}
