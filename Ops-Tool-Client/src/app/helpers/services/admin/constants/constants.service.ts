import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NTPTOOL } from 'src/app/constants';

@Injectable({
  providedIn: 'root'
})
export class ConstantsService {

  constructor(private http: HttpClient) { }

  getConstantsData(req = {}) {
    // const httpOptions = {
    //   headers: new HttpHeaders({
    //     token: this._authService.getToken(),
    //   })
    // };
    return this.http.post(environment.LOCALHOST + NTPTOOL.SUB.ADMIN + NTPTOOL.API.CONSTANT_LIST, req);
  }

  addConstantsData(data: any) {
    // const httpOptions = {
    //   headers: new HttpHeaders({
    //     token: this._authService.getToken(),
    //   })
    // };
    return this.http.post(environment.LOCALHOST + NTPTOOL.SUB.ADMIN + NTPTOOL.API.CONSTANT_CREATE, data);
  }

  deleteConstantsData(id: number) {
    // const httpOptions = {
    //   headers: new HttpHeaders({
    //     token: this._authService.getToken(),
    //   })
    // };
    return this.http.delete(environment.LOCALHOST + NTPTOOL.SUB.ADMIN + NTPTOOL.API.CONSTANT_DELETE + '/' + id);
  }
}
