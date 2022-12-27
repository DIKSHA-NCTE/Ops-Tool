import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NTPTOOL } from 'src/app/constants';


@Injectable({
  providedIn: 'root'
})
export class SubRoleService {
  constructor(private http: HttpClient) { }

  getSubRoleAddForm() {
    return this.http.get(environment.LOCALHOST + NTPTOOL.SUB.FORM + NTPTOOL.API.SUB_ROLE + NTPTOOL.API.FILTER);
  }
}