import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NTPTOOL } from 'src/app/constants';

@Injectable({
  providedIn: 'root'
})
export class SupportUsersServiceService {

  constructor(private http: HttpClient) { }

  public getAllSupportUsersList() {
    return this.http.get(environment.LOCALHOST + NTPTOOL.SUB.SUPPORT_USERS + NTPTOOL.API.LIST);
  }

  public fetchUserPermission(req: any) {
    return this.http.post(environment.LOCALHOST + NTPTOOL.SUB.SUPPORT_USERS + NTPTOOL.API.READ, req);
  }
}
