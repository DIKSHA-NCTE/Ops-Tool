import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NTPTOOL } from 'src/app/constants';

@Injectable({
  providedIn: 'root'
})
export class ContentsService {

  constructor(private http: HttpClient) { }

  getContentsList(req: any) {
    return this.http.post(environment.LOCALHOST + NTPTOOL.SUB.CONTENT + NTPTOOL.API.LIST, req);
  }

  getContentsFilter() {
    return this.http.get(environment.LOCALHOST + NTPTOOL.SUB.CONTENT + NTPTOOL.API.SUB_FILTER.SUB_LIST + NTPTOOL.API.FILTER);
  }
}
