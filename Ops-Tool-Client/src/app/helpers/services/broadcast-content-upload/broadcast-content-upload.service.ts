import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NTPTOOL } from 'src/app/constants';

@Injectable({
  providedIn: 'root'
})
export class BroadcastContentUploadService {

  constructor(private http: HttpClient) { }

  getBroadcastUploadFilter() {
    return this.http.get(environment.LOCALHOST + NTPTOOL.SUB.CONTENT + NTPTOOL.API.SUB_FILTER.SUB_UPLOAD + NTPTOOL.API.FILTER);
  }
  getBroadcastUploadStatusFilter() {
    return this.http.get(environment.LOCALHOST + NTPTOOL.SUB.CONTENT + NTPTOOL.API.SUB_FILTER.SUB_UPLOAD_STATUS + NTPTOOL.API.FILTER);
  }
  getBroadcastBatchUploadListFilter() {
    return this.http.get(environment.LOCALHOST + NTPTOOL.SUB.CONTENT + NTPTOOL.API.SUB_FILTER.SUB_BATCH_UPLOAD_LIST + NTPTOOL.API.FILTER);
  }

  getBroadcastUploadStatus(req: any) {
    return this.http.post(
      environment.LOCALHOST + NTPTOOL.SUB.CONTENT + NTPTOOL.API.BROADCAST + NTPTOOL.API.UPLOAD_STATUS,
      req
    );
  }

  getBatchUploadList(req: any) {
    return this.http.post(
      environment.LOCALHOST + NTPTOOL.SUB.CONTENT + NTPTOOL.API.BROADCAST + NTPTOOL.API.UPLOAD +'/' + NTPTOOL.API.STATUS,
      req
    );
  }

  broadcastContent(req: any) {
    return this.http.post(
      environment.LOCALHOST + NTPTOOL.SUB.CONTENT + NTPTOOL.API.BROADCAST_UPLOAD,
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
