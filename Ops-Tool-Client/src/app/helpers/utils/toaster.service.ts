import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToasterService {

  private emitChangeSource = new Subject<any>();
    changeEmitted$ = this.emitChangeSource.asObservable();

    // Service message
    emitChange(myMessage: any) {
        this.emitChangeSource.next(myMessage);
    }
}