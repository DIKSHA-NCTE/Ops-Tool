import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NTPTOOL } from 'src/app/constants';

@Injectable({
  providedIn: 'root',
})
export class CertificatesService {
  constructor(private http: HttpClient) {}

  getUserListing(req: any) {
    return this.http.post(
      environment.LOCALHOST + NTPTOOL.SUB.CERTIFICATE + NTPTOOL.API.SEARCH,
      req
    );
  }

  getEnrollmentList(req: any) {
    return this.http.post(
      environment.LOCALHOST + NTPTOOL.SUB.CERTIFICATE + NTPTOOL.API.ENROLLMENT,
      req
    );
  }

  getCourseBatch(req: any) {
    return this.http.post(
      environment.LOCALHOST + NTPTOOL.SUB.CERTIFICATE + NTPTOOL.API.SUB_FILTER.SUB_COURSE + NTPTOOL.API.SUB_FILTER.SUB_BATCH + NTPTOOL.API.LIST,
      req
    );
  }

  downloadSvgCertificate(req: any) {
    return this.http.post(
      environment.LOCALHOST + NTPTOOL.SUB.CERTIFICATE + NTPTOOL.API.CERT_SVG + NTPTOOL.API.DOWNLOAD,
      req
    );
  }

  downloadPdfCertificate(req: any) {
    return this.http.post(
      environment.LOCALHOST + NTPTOOL.SUB.CERTIFICATE + NTPTOOL.API.CERT_PDF + NTPTOOL.API.DOWNLOAD,
      req
    );
  }

  getUserCertificatesFilter() {
    return this.http.get(environment.LOCALHOST + NTPTOOL.SUB.CERTIFICATE + NTPTOOL.API.SUB_FILTER.SUB_USER + NTPTOOL.API.FILTER);
  }

  getCourseCertificatesFilter() {
    return this.http.get(environment.LOCALHOST + NTPTOOL.SUB.CERTIFICATE + NTPTOOL.API.SUB_FILTER.SUB_COURSE + NTPTOOL.API.FILTER);
  }
}
