import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NTPTOOL } from 'src/app/constants';


@Injectable({
  providedIn: 'root',
})
export class CourseService {
  constructor(private http: HttpClient) {}

  getCourseList(req: any) {
    return this.http.post(
      environment.LOCALHOST + NTPTOOL.SUB.COURSES + NTPTOOL.API.LIST,
      req
    );
  }

  getReportsSet(req: any) {
    return this.http.post(
      environment.LOCALHOST + NTPTOOL.SUB.COURSES + NTPTOOL.API.REPORTS, 
      req
      );
  }

  downloadReport(req: any) {
    return this.http.post(
      environment.LOCALHOST + NTPTOOL.SUB.COURSES + NTPTOOL.API.DOWNLOAD, 
      req
      );
  }

  getCourseFilter() {
    return this.http.get(environment.LOCALHOST + NTPTOOL.SUB.COURSES + NTPTOOL.API.FILTER);
  }
}
