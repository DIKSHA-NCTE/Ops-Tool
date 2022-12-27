import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NTPTOOL } from 'src/app/constants';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private http: HttpClient) { }

  public fetchUserAuth(req: any) {
    return this.http.post(environment.LOCALHOST + NTPTOOL.SUB.AUTH + NTPTOOL.API.TOKEN, req);
  }

  public getCurrentUserId() {
    let currentUser : any = localStorage.getItem("currentUser");
    if (currentUser) {
        return JSON.parse(currentUser)[0].userId;
    } else {
        return '';
    }
}

public getCurrentUserName() {
  let currentUser : any = localStorage.getItem("currentUser");
  if (currentUser) {
      return JSON.parse(currentUser)[0].userName;
  } else {
      return '';
  }
}
}
