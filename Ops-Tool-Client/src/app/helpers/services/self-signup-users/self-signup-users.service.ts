import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NTPTOOL } from 'src/app/constants';

@Injectable({
  providedIn: 'root',
})
export class SelfSignupUsersService {
  constructor(private http: HttpClient) {}

  getSelfSignupUsersList(req: any) {
    return this.http.post(
      environment.LOCALHOST + NTPTOOL.SUB.SSU + NTPTOOL.API.DOWNLOAD,
      req
    );
  }
  getSsuFilter() {
    return this.http.get(environment.LOCALHOST + NTPTOOL.SUB.SSU + NTPTOOL.API.FILTER);
  }
}
