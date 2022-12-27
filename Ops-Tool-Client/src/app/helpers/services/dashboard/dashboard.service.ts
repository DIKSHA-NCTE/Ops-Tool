import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NTPTOOL } from 'src/app/constants';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient) { }

  getDashboardData() {
    return this.http.get(environment.LOCALHOST + NTPTOOL.SUB.DASHBOARD + NTPTOOL.API.LIST);
  }
}
