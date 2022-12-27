import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NTPTOOL } from 'src/app/constants';

@Injectable({
  providedIn: 'root'
})
export class ContentsBulkUploadService {

  constructor(private http: HttpClient) { }

  getContentUploadFilter() {
    return this.http.get(environment.LOCALHOST + NTPTOOL.SUB.CONTENT + NTPTOOL.API.SUB_FILTER.SUB_UPLOAD + NTPTOOL.API.FILTER);
  }
  getContentUploadStatusFilter() {
    return this.http.get(environment.LOCALHOST + NTPTOOL.SUB.CONTENT + NTPTOOL.API.SUB_FILTER.SUB_UPLOAD_STATUS + NTPTOOL.API.FILTER);
  }
  getContentBatchUploadListFilter() {
    return this.http.get(environment.LOCALHOST + NTPTOOL.SUB.CONTENT + NTPTOOL.API.SUB_FILTER.SUB_BATCH_UPLOAD_LIST + NTPTOOL.API.FILTER);
  }

  getContentUploadStatus(req: any) {
    return this.http.post(
      environment.LOCALHOST + NTPTOOL.SUB.CONTENT + NTPTOOL.API.UPLOAD_STATUS,
      req
    );
  }

  getBatchUploadList(req: any) {
    return this.http.post(
      environment.LOCALHOST + NTPTOOL.SUB.CONTENT + NTPTOOL.API.UPLOAD +'/' + NTPTOOL.API.STATUS,
      req
    );
  }

  uploadContent(req: any) {
    return this.http.post(
      environment.LOCALHOST + NTPTOOL.SUB.CONTENT + NTPTOOL.API.CONTENT_UPLOAD,
      req
    );
  }

  channelRead(req: any) {
    return this.http.post(
      environment.LOCALHOST + NTPTOOL.SUB.CHANNEL + NTPTOOL.API.READ,
      req
    );
  }
}
