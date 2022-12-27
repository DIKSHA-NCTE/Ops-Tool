import { Component, Input, Output, EventEmitter, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ToasterService } from 'src/app/helpers/utils/toaster.service';
import { Toast } from '../../../../helpers/interfaces/toaster.interface';

@Component({
  selector: 'app-toaster',
  templateUrl: './toaster.component.html',
  styleUrls: ['./toaster.component.scss']
})
export class ToasterComponent implements OnInit {
  public toasts: Toast[] = [];

  constructor(private _toaster: ToasterService) {
    this._toaster.changeEmitted$.subscribe(resp => {
      this.toasts = [];
      this.toasts.push(resp);
      setTimeout(() => this.toasts.pop(), resp.delay || 6000);
    });
  }

  ngOnInit(): void { };

  remove(index: number) {
    this.toasts = this.toasts.filter((v, i) => i !== index);
  }
}