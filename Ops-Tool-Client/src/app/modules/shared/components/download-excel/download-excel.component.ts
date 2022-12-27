import { Component, Input, OnInit } from '@angular/core';
import { SharedService } from 'src/app/helpers/services/shared/shared.service';

@Component({
  selector: 'app-download-excel',
  templateUrl: './download-excel.component.html',
  styleUrls: ['./download-excel.component.scss']
})
export class DownloadExcelComponent implements OnInit {
  @Input() data: any;
  @Input() file: any;
  excel: any;
  constructor(public _sharedService: SharedService) { }

  ngOnInit(): void {
    
  }

  // downloadExcelFile(id) {
  //   // tslint:disable-next-line: max-line-length
  //   alasql('SELECT name AS [Name of the Content], description AS [Description of the content in one line - telling about the content], board AS Board , medium  AS Medium, grade AS Grade, subject AS Subject, Topic AS Topic, primaryCategory AS [Primary Category], additionalCategories AS [Additional Categories], keywords AS Keywords, audience AS Audience, attribution AS [Attribution Credits], icon AS [Icon], fileFormat AS [File Format], path  AS [File Path], author AS Author, copyRight AS Copyright, copyrightYear AS [Year of Creation], license AS License, status AS Identifier, failStatus AS [Failure Reason], playurl AS[PLAY URL] INTO XLSX(\'content_report_' + id + '.xlsx\',{headers:true}) FROM ? ', [this.statusTableData]);
  // }


  downloadExcelFromJson() {
    if(this.file.includes('contentUploadStatus') || this.file.includes('shallowCopyUploadStatus')) {
      let contentReport = JSON.parse(JSON.stringify(this.data.filteredData));
      contentReport.map((el: any) => {
        delete el['Process ID']
      })
      this.excel = this._sharedService.exportAsExcelFile(contentReport, this.file)
    } else {
      this.excel = this._sharedService.exportAsExcelFile(this.data.filteredData, this.file)
    }
  }

  ngAfterViewInit(): void {
  }
}
