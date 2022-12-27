import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CourseService } from 'src/app/helpers/services/course/course.service';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent implements OnInit {
  @ViewChild('popupTemplate') popupDialog!: TemplateRef<any>;
  batchId: any;
  dialogRef: any;
  userinfoShow: any;
  progressShow: any;
  responseShow: any;
  progressExhaustArr: any;
  growlData: { severity: string; summary: any; detail: string; } | undefined;
  _comm: any;

  constructor(public dialog: MatDialog, private _courses: CourseService) { }

  ngOnInit(): void {
  }

  openPopup(element: any) {
    this.batchId = ''
    this.batchId = element['batchId']
    this.dialogRef = this.dialog.open(this.popupDialog,{
    });
  }
  
  getExhaustReports(type: any, batchId: any, courseId: any, channelId: any) {
    const temp = {
      batchId: batchId,
      courseId: courseId,
      channelId: channelId,
      type: `${type}-exhaust/`
    };

    this._courses.getReportsSet(temp).subscribe((res: any) => {
      if (type === 'progress') {
        this.userinfoShow = false;
        this.progressShow = true;
        this.responseShow = false;
      } else if (type === 'userinfo') {
        this.progressShow = false;
        this.userinfoShow = true;
        this.responseShow = false;
      } else if (type === 'response') {
        this.progressShow = false;
        this.userinfoShow = false;
        this.responseShow = true;
      }

      if (res.statusCode === 200 && res.response.length > 0) {
        this.progressExhaustArr = res.response;
      } else {
        this.progressExhaustArr = [];
      }
    }, error => {
      this.growlData = {
        severity: 'error',
        'summary': error.error,
        'detail': ''
      };
      this._comm.emitStatus(this.growlData);
    });
  }

}
