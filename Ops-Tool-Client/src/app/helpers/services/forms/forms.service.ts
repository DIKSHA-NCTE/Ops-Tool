import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NTPTOOL } from 'src/app/constants';


@Injectable({
  providedIn: 'root'
})
export class FormsService {
  constructor(private http: HttpClient) { }

  readForm(req: any) {
    return this.http.post(environment.LOCALHOST + NTPTOOL.SUB.FORM + NTPTOOL.API.READ, req);
  }
  listForm(req: any) {
    return this.http.post(environment.LOCALHOST + NTPTOOL.SUB.FORM + NTPTOOL.API.LIST, req);
  }
  updateForm(req: any) {
    return this.http.post(environment.LOCALHOST + NTPTOOL.SUB.FORM + NTPTOOL.API.UPDATE, req);
  }
  getFormsFilter() {
    return this.http.get(environment.LOCALHOST + NTPTOOL.SUB.FORM + NTPTOOL.API.SUB_FILTER.SUB_LIST + NTPTOOL.API.FILTER);
  }
}
