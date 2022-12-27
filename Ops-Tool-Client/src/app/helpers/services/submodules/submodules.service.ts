import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NTPTOOL } from 'src/app/constants';

@Injectable({
  providedIn: 'root'
})
export class SubmodulesService {

  constructor(private http: HttpClient) { }

  getSubmodulesData(req: any) {
    return this.http.post(environment.LOCALHOST + NTPTOOL.SUB.SUBMODULES + NTPTOOL.API.LIST, req);
  }
}
