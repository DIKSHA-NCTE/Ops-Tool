import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NTPTOOL } from 'src/app/constants';

@Injectable({
  providedIn: 'root'
})
export class ShallowCopyService {

  constructor(private http: HttpClient) { }

  getShallowCopyUploadFilter() {
    return this.http.get(environment.LOCALHOST + NTPTOOL.SUB.CONTENT + NTPTOOL.API.SUB_FILTER.SUB_UPLOAD + NTPTOOL.API.FILTER);
  }
  getShallowCopyUploadStatusFilter() {
    return this.http.get(environment.LOCALHOST + NTPTOOL.SUB.CONTENT + NTPTOOL.API.SUB_FILTER.SUB_UPLOAD_STATUS + NTPTOOL.API.FILTER);
  }
  getShallowCopyBatchUploadListFilter() {
    return this.http.get(environment.LOCALHOST + NTPTOOL.SUB.CONTENT + NTPTOOL.API.SUB_FILTER.SUB_BATCH_UPLOAD_LIST + NTPTOOL.API.FILTER);
  }

  getShallowCopyUploadStatus(req: any) {
    return this.http.post(
      environment.LOCALHOST + NTPTOOL.SUB.CONTENT + NTPTOOL.API.SHALLOW_COPY + NTPTOOL.API.UPLOAD_STATUS,
      req
    );
  }

  getBatchUploadList(req: any) {
    return this.http.post(
      environment.LOCALHOST + NTPTOOL.SUB.CONTENT + NTPTOOL.API.SHALLOW_COPY + NTPTOOL.API.STATUS,
      req
    );
  }

  uploadShallowCopy(req: any) {
    return this.http.post(
      environment.LOCALHOST + NTPTOOL.SUB.CONTENT + NTPTOOL.API.SHALLOW_COPY_UPLOAD,
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
