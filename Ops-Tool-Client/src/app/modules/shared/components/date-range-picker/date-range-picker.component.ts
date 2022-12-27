import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { SharedService } from 'src/app/helpers/services/shared/shared.service';

@Component({
  selector: 'app-date-range-picker',
  templateUrl: './date-range-picker.component.html',
  styleUrls: ['./date-range-picker.component.scss']
})
export class DateRangePickerComponent implements OnInit {
  @Input() label: any;
  @Input() property: any;
  @Input() dataType: any;
  @Input() required: boolean = false;

  @Output() getSelectedValue = new EventEmitter<any>();
  selectedRange: any;

  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });
  constructor(private _shared: SharedService) {
    this._shared.loaderStatusEmitted$.subscribe((result: any) => {
      if (result === true) this.range.reset();
    });
  }

  ngOnInit(): void {
  }

  detectDateRangeChanges() {
    let sd = new Date(this.range.value.start),
      ed = new Date(this.range.value.end);
    sd = new Date(sd.setDate(sd.getDate() + 1));
    ed = new Date(ed.setDate(ed.getDate() + 1));
    if (this.range.value.start != null && this.range.value.end != null) {
      this.selectedRange = {
        '<=': ed.toISOString().split('T')[0],
        '>=': sd.toISOString().split('T')[0]
      }
    } else if (this.range.value.start != null && this.range.value.end == null) {
      this.selectedRange = sd.toISOString().split('T')[0];
    } else if (this.range.value.end != null && this.range.value.start == null) {
      this.selectedRange = ed.toISOString().split('T')[0];
    } else {
      this.selectedRange = null;
    }
    this.getSelectedValue.next({ property: this.property, dataType: this.dataType, value: this.selectedRange });
  }
}