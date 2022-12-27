import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs';
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  sharedData: any;

  constructor() { }

  private resetValuesSource = new Subject<any>();

  loaderStatusEmitted$ = this.resetValuesSource.asObservable();

  emitResetStatus(data: any) {
    this.resetValuesSource.next(data);
  }

  private updateValuesSource = new Subject<any>();

  loadUpdateStatus$ = this.updateValuesSource.asObservable();

  emitUpdateStatus(data: any) {
    this.updateValuesSource.next(data);
  }

  static toExportFileName(excelFileName: string) {
    return `${excelFileName}_export_${new Date().getTime()}.xlsx`;
  }

  public exportAsExcelFile(json: any[], excelFileName: string) {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = {Sheets: {'data': worksheet}, SheetNames: ['data']};
    XLSX.writeFile(workbook, SharedService.toExportFileName(excelFileName));
  }
}