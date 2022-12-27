import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NTPTOOL } from 'src/app/constants';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private http: HttpClient) {}

  getUsersList(req: any) {
    return this.http.post(
      environment.LOCALHOST + NTPTOOL.SUB.USER + NTPTOOL.API.SEARCH,
      req
    );
  }
  getUsersFilter() {
    return this.http.get(environment.LOCALHOST + NTPTOOL.SUB.USER + NTPTOOL.API.SUB_FILTER.SUB_LIST + NTPTOOL.API.FILTER);
  }
  getCreateUsersFilter() {
    return this.http.get(environment.LOCALHOST + NTPTOOL.SUB.USER + NTPTOOL.API.SUB_FILTER.SUB_CREATE + NTPTOOL.API.FILTER);
  }
  readUser(req: any) {
    return this.http.post(
      environment.LOCALHOST + NTPTOOL.SUB.USER + NTPTOOL.API.READ,
      req
    );
  }
  updateUserDetails(req: any) {
    return this.http.post(
      environment.LOCALHOST + NTPTOOL.SUB.USER + NTPTOOL.API.UPDATE,
      req
    );
  }
  updateUserRole(req: any) {
    return this.http.post(
      environment.LOCALHOST + NTPTOOL.SUB.USER + NTPTOOL.API.ASSIGN,
      req
    );
  }
  createUser(req: any) {
    return this.http.post(
      environment.LOCALHOST + NTPTOOL.SUB.USER + NTPTOOL.API.CREATE,
      req
    );
  }
}
