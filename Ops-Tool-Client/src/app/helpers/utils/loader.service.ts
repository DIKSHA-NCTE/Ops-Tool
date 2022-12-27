import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  private emitLoaderSource = new Subject<any>();
    loaderStatusEmitted$ = this.emitLoaderSource.asObservable();

    emitLoaderStatus(status: any) {
        this.emitLoaderSource.next(status);
    }
}