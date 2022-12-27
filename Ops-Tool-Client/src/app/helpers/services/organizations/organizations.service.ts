import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NTPTOOL } from 'src/app/constants';

@Injectable({
  providedIn: 'root',
})
export class OrganizationsService {
  constructor(private http: HttpClient) {}

  getOrganizationsList(req: any) {
    return this.http.post(
      environment.LOCALHOST + NTPTOOL.SUB.TENANT + NTPTOOL.API.LIST,
      req
    );
  }
  readOrganization(req: any) {
    return this.http.post(
      environment.LOCALHOST + NTPTOOL.SUB.TENANT + NTPTOOL.API.READ,
      req
    );
  }
  createOrganizations(req: any) {
    return this.http.post(
      environment.LOCALHOST + NTPTOOL.SUB.TENANT + NTPTOOL.API.CREATE,
      req
    );
  }
  updateOrganizations(req: any) {
    return this.http.post(
      environment.LOCALHOST + NTPTOOL.SUB.TENANT + NTPTOOL.API.UPDATE,
      req
    );
  }
  getOrganizationsListFilter() {
    return this.http.get(environment.LOCALHOST + NTPTOOL.SUB.TENANT + NTPTOOL.API.SUB_FILTER.SUB_LIST + NTPTOOL.API.FILTER);
  }
  getOrganizationsCreateFilter() {
    return this.http.get(environment.LOCALHOST + NTPTOOL.SUB.TENANT + NTPTOOL.API.CREATE + '/' + NTPTOOL.API.FILTER);
  }
  getOrganizationsUpdateFilter() {
    return this.http.get(environment.LOCALHOST + NTPTOOL.SUB.TENANT + NTPTOOL.API.UPDATE + '/' + NTPTOOL.API.FILTER);
  }
}
