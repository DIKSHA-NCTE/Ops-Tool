import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NTPTOOL } from 'src/app/constants';
import { AuthenticationService } from '../../authentication/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class SupportUsersService {

  constructor(private http: HttpClient, public _auth: AuthenticationService) { }

  public getSupportUsersList() {
    const data = {
      userId: this._auth.getCurrentUserId(),
      userName: this._auth.getCurrentUserName()
    };
    return this.http.post(environment.LOCALHOST + NTPTOOL.SUB.SUPPORT_USERS + NTPTOOL.API.LIST, data);
  }

  public addNewSupportUser(req: any) {
    req.userId = this._auth.getCurrentUserId();
    req.userName = this._auth.getCurrentUserName();
    return this.http.post(environment.LOCALHOST + NTPTOOL.SUB.SUPPORT_USERS + NTPTOOL.API.ADD, req);
  }

  public updateSupportUser(req: any) {
    req.userId = this._auth.getCurrentUserId();
    req.userName = this._auth.getCurrentUserName();
    return this.http.post(environment.LOCALHOST + NTPTOOL.SUB.SUPPORT_USERS + NTPTOOL.API.UPDATE, req);
  }

  public deleteSupportUser(req: any) {
    req.uid = this._auth.getCurrentUserId();
    req.uname = this._auth.getCurrentUserName();
    return this.http.post(environment.LOCALHOST + NTPTOOL.SUB.SUPPORT_USERS + NTPTOOL.API.DELETE, req);
  }

  public fetchIndividualUser(req: any) {
    return this.http.post(environment.LOCALHOST + NTPTOOL.SUB.SUPPORT_USERS + NTPTOOL.API.READ, req);
  }

}
