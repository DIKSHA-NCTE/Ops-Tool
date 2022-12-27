import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NTPTOOL } from 'src/app/constants';

@Injectable({
  providedIn: 'root'
})
export class UsersBulkUploadService {

  constructor(private http: HttpClient) { }

  getUserUploadFilter() {
    return this.http.get(environment.LOCALHOST + NTPTOOL.SUB.USER + NTPTOOL.API.SUB_FILTER.SUB_UPLOAD + NTPTOOL.API.FILTER);
  }
  getUserUploadStatusFilter() {
    return this.http.get(environment.LOCALHOST + NTPTOOL.SUB.USER + NTPTOOL.API.SUB_FILTER.SUB_UPLOAD_STATUS + NTPTOOL.API.FILTER);
  }
  getUserBatchUploadListFilter() {
    return this.http.get(environment.LOCALHOST + NTPTOOL.SUB.USER + NTPTOOL.API.SUB_FILTER.SUB_BATCH_UPLOAD_LIST + NTPTOOL.API.FILTER);
  }

  getUserUploadStatus(req: any) {
    return this.http.post(
      environment.LOCALHOST + NTPTOOL.SUB.USER + NTPTOOL.API.DATA,
      req
    );
  }

  getBatchUploadList(req: any) {
    return this.http.post(
      environment.LOCALHOST + NTPTOOL.SUB.USER + NTPTOOL.API.STATUS,
      req
    );
  }

  uploadUser(req: any) {
    return this.http.post(
      environment.LOCALHOST + NTPTOOL.SUB.USER + NTPTOOL.API.UPLOAD,
      req
    );
  }
}