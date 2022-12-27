import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SharedService } from 'src/app/helpers/services/shared/shared.service';

@Component({
  selector: 'app-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.scss']
})
export class FileComponent {
  @Input() label: any;
  @Input() property: any;
  @Input() dataType: any;
  @Input() type: any;
  @Input() required: boolean = false;
  fileName: any;

  @Output() getSelectedValue = new EventEmitter<any>();

  constructor(private _shared: SharedService) {
    this._shared.loaderStatusEmitted$.subscribe((result: any) => {
      if (result.status === true && result.type === 'all') {
        this.fileName = null
      } else {
        if (result.status === true && result.value == this.fileName.toString()) {
          this.fileName = null
        }
      }
    });
  }

  getSelectedFile(event: any) {
    const file:File = event.target.files[0];
        if (file) {
            this.fileName = file.name;
          }
          this.getSelectedValue.next({ property: this.property, dataType: this.dataType, value: file });
  }
  }
