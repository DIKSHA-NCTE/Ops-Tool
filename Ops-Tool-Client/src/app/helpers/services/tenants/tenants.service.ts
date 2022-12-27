import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NTPTOOL } from 'src/app/constants';

@Injectable({
  providedIn: 'root'
})
export class TenantsService {

  constructor(private http: HttpClient) { }

  getRootTenantsList(req: any) {
    return this.http.post(environment.LOCALHOST + NTPTOOL.SUB.TENANT + NTPTOOL.API.LIST, req);
  }
}
